async function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function routeKey(req: any): string {
  const segments = req.query?.path;
  if (Array.isArray(segments) && segments.length > 0) {
    return segments.join('/');
  }
  if (typeof segments === 'string' && segments) {
    return segments;
  }

  const rawUrl = String(req.url || '');
  const cleanUrl = rawUrl.split('?')[0];
  const marker = '/api/rewards/';
  const idx = cleanUrl.indexOf(marker);
  if (idx >= 0) {
    return cleanUrl.slice(idx + marker.length).replace(/\/$/, '');
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

  const supabase = await getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const code = rawCode.trim().toUpperCase();
  const { data, error } = await supabase
    .from('coupons')
    .select('code, reward_amount, status')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, message: 'Database error' });
  }
  if (!data) {
    return res.json({ success: false, status: 'INVALID', message: 'Invalid Coupon Code' });
  }
  if (data.status === 'used' || data.status === 'redeemed') {
    return res.json({
      success: false,
      status: 'REDEEMED',
      message: 'This coupon has already been redeemed.',
    });
  }

  return res.json({
    success: true,
    status: 'VALID',
    message: 'Coupon Verified Successfully. Please complete your details to reveal your reward.',
  });
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

  const supabase = await getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const code = rawCode.trim().toUpperCase();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const referenceId = `SRA-${dateStr}-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data: updated, error: updateError } = await supabase
    .from('coupons')
    .update({ status: 'used' })
    .eq('code', code)
    .eq('status', 'active')
    .select('code, reward_amount')
    .maybeSingle();

  if (updateError) {
    return res.status(500).json({ success: false, message: 'Database error' });
  }
  if (!updated) {
    const { data: existing } = await supabase.from('coupons').select('status').eq('code', code).maybeSingle();
    if (!existing) {
      return res.status(400).json({ success: false, status: 'INVALID', message: 'Invalid Coupon Code' });
    }
    return res.status(400).json({
      success: false,
      status: 'REDEEMED',
      message: 'This coupon has already been redeemed.',
    });
  }

  const claimRow = {
    coupon_code: updated.code,
    customer_name: String(retailerName).trim(),
    customer_phone: String(phone).trim(),
    customer_email: email ? String(email).trim() : null,
    shop_name: String(shopName).trim(),
    distributor: String(distributor).trim(),
    village: String(village).trim(),
    tehsil: tehsil ? String(tehsil).trim() : null,
    district: String(district).trim(),
    state: String(state).trim(),
    gst: gst ? String(gst).trim() : null,
    shop_photo: shopPhoto || null,
    reference_id: referenceId,
    reward_amount: updated.reward_amount,
  };

  const { error: claimError } = await supabase.from('claims').insert(claimRow);
  if (claimError) {
    await supabase.from('claims').insert({
      coupon_code: updated.code,
      customer_name: claimRow.customer_name,
      customer_phone: claimRow.customer_phone,
      customer_email: claimRow.customer_email,
    });
  }

  return res.json({
    success: true,
    referenceId,
    rewardAmount: updated.reward_amount,
    submittedAt: now.toISOString(),
    message: 'Your coupon has been redeemed successfully.',
  });
}

async function handleAdminData(_req: any, res: any) {
  const supabase = await getSupabase();
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

  return res.json({
    success: true,
    metrics: {
      totalCoupons: couponList.length,
      activeCoupons: couponList.filter((c: any) => c.status === 'active').length,
      redeemedCoupons: redemptions.length,
      totalRewardAmount: redemptions.reduce((sum: number, r: any) => sum + r.rewardAmount, 0),
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

  const supabase = await getSupabase();
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Rewards database is not configured on the server.' });
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
    codeList = rawText.split(/[\r\n,;\s]+/).map((c) => c.trim().toUpperCase()).filter(Boolean);
  }
  if (codeList.length === 0) {
    return res.status(400).json({ success: false, message: 'No coupon codes provided' });
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Rewards database is not configured on the server.' });
  }

  const uniqueCodes = [...new Set(codeList)];
  const { data: existingRows } = await supabase.from('coupons').select('code').in('code', uniqueCodes);
  const existing = new Set((existingRows || []).map((r: any) => r.code));
  const toInsert = uniqueCodes
    .filter((c) => !existing.has(c))
    .map((c) => ({ code: c, reward_amount: amount, status: 'active' }));

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
  return res.json({
    success: true,
    message: 'Test email endpoint reached. Configure SMTP_USER/SMTP_PASS in Vercel env for delivery.',
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

    return res.status(404).json({ success: false, message: 'Not found', route });
  } catch (err: any) {
    console.error('[rewards]', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Server error',
    });
  }
}
