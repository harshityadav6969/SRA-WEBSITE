import { getSupabase } from '../_lib/supabase';
import { sendRealEmail } from '../_lib/email';

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const code = rawCode.trim().toUpperCase();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSeq = Math.floor(100000 + Math.random() * 900000);
  const referenceId = `SRA-${dateStr}-${randomSeq}`;

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
    const { data: existing } = await supabase
      .from('coupons')
      .select('status')
      .eq('code', code)
      .maybeSingle();

    if (!existing) {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'Invalid Coupon Code',
      });
    }

    return res.status(400).json({
      success: false,
      status: 'REDEEMED',
      message: 'This coupon has already been redeemed.',
    });
  }

  const fullClaim = {
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

  const { error: claimError } = await supabase.from('claims').insert(fullClaim);
  if (claimError) {
    await supabase.from('claims').insert({
      coupon_code: updated.code,
      customer_name: fullClaim.customer_name,
      customer_phone: fullClaim.customer_phone,
      customer_email: fullClaim.customer_email,
    });
  }

  const formattedDate = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const emailBody = [
    `Reference ID: ${referenceId}`,
    `Coupon Code: ${code}`,
    `Reward: ₹${updated.reward_amount}`,
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
  const subject = `🎉 New SRA Reward Redemption (${code} - ₹${updated.reward_amount})`;

  sendRealEmail(ADMIN_EMAIL, subject, emailBody).catch((err) => {
    console.error('[EMAIL DISPATCH FAILED]', err);
  });

  return res.json({
    success: true,
    referenceId,
    rewardAmount: updated.reward_amount,
    submittedAt: now.toISOString(),
    message: 'Your coupon has been redeemed successfully.',
  });
}
