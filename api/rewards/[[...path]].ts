import { verifyCouponCode, claimCoupon } from '../_lib/rewards';
import { getSupabase } from '../_lib/supabase';
import { sendRealEmail } from '../_lib/email';

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function routeKey(req: any): string {
  const segments = req.query?.path;
  if (Array.isArray(segments)) {
    return segments.join('/');
  }
  if (typeof segments === 'string') {
    return segments;
  }
  return '';
}

async function handleVerify(req: any, res: any) {
  const rawCode = req.method === 'GET' ? req.query?.code : req.body?.code;
  if (!rawCode || typeof rawCode !== 'string') {
    return res.status(400).json({
      success: false,
      status: 'INVALID',
      message: 'Please enter a valid coupon code.',
    });
  }

  const result = await verifyCouponCode(rawCode);
  if (result.status === 'ERROR') {
    return res.status(result.httpStatus || 500).json({
      success: false,
      message: result.message,
    });
  }
  return res.json(result);
}

async function handleClaim(req: any, res: any) {
  const body = req.body || {};
  const {
    code: rawCode,
    retailerName,
    shopName,
    distributor,
    village,
    tehsil,
    district,
    state,
    phone,
    email,
    gst,
    shopPhoto,
  } = body;

  if (!rawCode || typeof rawCode !== 'string') {
    return res.status(400).json({ success: false, message: 'Coupon code is required.' });
  }

  if (!retailerName || !shopName || !distributor || !village || !district || !state || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all required retailer information fields marked with *',
    });
  }

  const result = await claimCoupon({
    code: rawCode,
    retailerName,
    shopName,
    distributor,
    village,
    tehsil,
    district,
    state,
    phone,
    email,
    gst,
    shopPhoto,
  });

  if (!result.success) {
    const status = 'httpStatus' in result ? result.httpStatus || 400 : 400;
    return res.status(status).json(result);
  }

  const now = new Date(result.submittedAt);
  const formattedDate = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const emailBody = [
    `Reference ID: ${result.referenceId}`,
    `Coupon Code: ${String(rawCode).trim().toUpperCase()}`,
    `Reward: ₹${result.rewardAmount}`,
    `Retailer Name: ${String(retailerName).trim()}`,
    `Shop Name: ${String(shopName).trim()}`,
    `Distributor: ${String(distributor).trim()}`,
    `Village: ${String(village).trim()}`,
    `Tehsil: ${tehsil ? String(tehsil).trim() : 'N/A'}`,
    `District: ${String(district).trim()}`,
    `State: ${String(state).trim()}`,
    `Phone: ${String(phone).trim()}`,
    `Email: ${email ? String(email).trim() : 'N/A'}`,
    `GST: ${gst ? String(gst).trim() : 'N/A'}`,
    `Submitted On: ${formattedDate}`,
    `Shop Photo: ${shopPhoto ? '[Photo Uploaded]' : 'None'}`,
  ].join('\n\n');

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'srashrijiagrigeneticsseeds@gmail.com';
  const subject = `🎉 New SRA Reward Redemption (${String(rawCode).trim().toUpperCase()} - ₹${result.rewardAmount})`;

  sendRealEmail(ADMIN_EMAIL, subject, emailBody).catch((err) => {
    console.error('[EMAIL DISPATCH FAILED]', err);
  });

  return res.json(result);
}

async function handleAdminData(_req: any, res: any) {
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const [{ data: coupons, error: couponsError }, { data: claims, error: claimsError }] =
    await Promise.all([
      supabase.from('coupons').select('code, reward_amount, status, created_at').order('created_at', { ascending: false }),
      supabase.from('claims').select('*').order('id', { ascending: false }),
    ]);

  if (couponsError || claimsError) {
    return res.status(500).json({ success: false, message: 'Database error' });
  }

  const couponList = (coupons || []).map((c: any) => ({
    code: c.code,
    rewardAmount: c.reward_amount,
    status: c.status === 'used' ? 'redeemed' : c.status,
    createdAt: c.created_at,
    redeemedByRef: undefined,
  }));

  const redemptions = (claims || []).map((r: any) => ({
    referenceId: r.reference_id || `CLAIM-${r.id}`,
    couponCode: r.coupon_code,
    rewardAmount: Number(r.reward_amount || 0),
    retailerName: r.customer_name || '',
    shopName: r.shop_name || '',
    distributor: r.distributor || '',
    village: r.village || '',
    tehsil: r.tehsil || '',
    district: r.district || '',
    state: r.state || '',
    phone: r.customer_phone || '',
    email: r.customer_email || '',
    gst: r.gst || '',
    shopPhoto: r.shop_photo || '',
    submittedAt: r.created_at || new Date().toISOString(),
  }));

  const totalRewardAmount = redemptions.reduce((sum: number, r: any) => sum + r.rewardAmount, 0);

  return res.json({
    success: true,
    metrics: {
      totalCoupons: couponList.length,
      activeCoupons: couponList.filter((c: any) => c.status === 'active').length,
      redeemedCoupons: redemptions.length,
      totalRewardAmount,
    },
    redemptions,
    coupons: couponList,
    emailLogs: [],
  });
}

async function handleCreateCoupon(req: any, res: any) {
  const { code: rawCode, rewardAmount } = req.body || {};
  if (!rawCode || !rewardAmount) {
    return res.status(400).json({ success: false, message: 'Code and reward amount are required' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const code = String(rawCode).trim().toUpperCase();
  const { data: existing } = await supabase.from('coupons').select('code').eq('code', code).maybeSingle();
  if (existing) {
    return res.status(400).json({ success: false, message: 'Coupon code already exists' });
  }

  const { error } = await supabase.from('coupons').insert({
    code,
    reward_amount: Number(rewardAmount),
    status: 'active',
  });

  if (error) {
    return res.status(500).json({ success: false, message: 'Database error' });
  }

  return res.json({ success: true, message: `Coupon ${code} created successfully!` });
}

async function handleBulkCreateCoupons(req: any, res: any) {
  const { codes, rawText, rewardAmount } = req.body || {};
  const amount = Number(rewardAmount);

  if (!amount || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'A valid positive reward amount is required' });
  }

  let codeList: string[] = [];
  if (Array.isArray(codes)) {
    codeList = codes.map((c: string) => String(c).trim().toUpperCase()).filter(Boolean);
  } else if (typeof rawText === 'string') {
    codeList = rawText
      .split(/[\r\n,;\s]+/)
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
  }

  if (codeList.length === 0) {
    return res.status(400).json({ success: false, message: 'No coupon codes provided' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const uniqueCodes = [...new Set(codeList)];
  const { data: existingRows } = await supabase.from('coupons').select('code').in('code', uniqueCodes);
  const existing = new Set((existingRows || []).map((r: any) => r.code));

  const toInsert = uniqueCodes
    .filter((code) => !existing.has(code))
    .map((code) => ({
      code,
      reward_amount: amount,
      status: 'active',
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from('coupons').insert(toInsert);
    if (error) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
  }

  return res.json({
    success: true,
    addedCount: toInsert.length,
    skippedCount: uniqueCodes.length - toInsert.length,
    message: `Successfully imported ${toInsert.length} coupon(s) for ₹${amount}! (${uniqueCodes.length - toInsert.length} already existed).`,
  });
}

async function handleSendTestEmail(_req: any, res: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'srashrijiagrigeneticsseeds@gmail.com';
  const subject = '🧪 Test Email Dispatch from SRA Rewards Portal';
  const bodyText = `Hello Admin,\n\nThis is a test notification email sent to ${adminEmail} from SRA Rewards Portal.\n\nTimestamp: ${new Date().toLocaleString()}\n\nAll email notifications for new coupon redemptions will be dispatched to this address.`;

  const result = await sendRealEmail(adminEmail, subject, bodyText);

  return res.json({
    success: true,
    recipient: adminEmail,
    dispatchResult: result,
    message: result.sent
      ? `Test email sent successfully to ${adminEmail} via ${result.method}!`
      : `Email could not be delivered to ${adminEmail}. (${result.detail || 'Configure SMTP_USER/SMTP_PASS for external inbox delivery'})`,
  });
}

export default async function handler(req: any, res: any) {
  setCors(res);

  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const route = routeKey(req);

    if (route === 'verify-coupon' && (req.method === 'GET' || req.method === 'POST')) {
      return handleVerify(req, res);
    }

    if (route === 'claim' && req.method === 'POST') {
      return handleClaim(req, res);
    }

    if (route === 'admin/data' && req.method === 'GET') {
      return handleAdminData(req, res);
    }

    if (route === 'admin/create-coupon' && req.method === 'POST') {
      return handleCreateCoupon(req, res);
    }

    if (route === 'admin/bulk-create-coupons' && req.method === 'POST') {
      return handleBulkCreateCoupons(req, res);
    }

    if (route === 'admin/send-test-email' && req.method === 'POST') {
      return handleSendTestEmail(req, res);
    }

    return res.status(404).json({ success: false, message: 'Not found' });
  } catch (err: any) {
    console.error('[rewards]', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Server error',
    });
  }
}
