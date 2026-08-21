import { getSupabase } from '../_lib/supabase';

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Verify only — never mark the coupon used here.
  // Redemption happens in POST /api/rewards/claim after retailer details are submitted.
  const rawCode = req.method === 'GET' ? req.query?.code : req.body?.code;
  if (!rawCode || typeof rawCode !== 'string') {
    return res.status(400).json({
      success: false,
      status: 'INVALID',
      message: 'Please enter a valid coupon code.',
    });
  }

  const code = rawCode.trim().toUpperCase();
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Rewards database is not configured on the server.',
    });
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('code, reward_amount, status')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, message: 'Database error' });
  }

  if (!data) {
    return res.json({
      success: false,
      status: 'INVALID',
      message: 'Invalid Coupon Code',
    });
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
