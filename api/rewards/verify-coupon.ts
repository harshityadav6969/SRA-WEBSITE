import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCors(res);

  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const rawCode = req.method === 'GET' ? req.query?.code : req.body?.code;
    if (!rawCode || typeof rawCode !== 'string') {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'Please enter a valid coupon code.',
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
  } catch (err: any) {
    console.error('[verify-coupon]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during coupon verification.',
    });
  }
}
