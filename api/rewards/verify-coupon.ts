export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return res.status(500).json({
        success: false,
        message: 'Rewards database is not configured on the server.',
      });
    }

    const rawCode = req.method === 'GET' ? req.query?.code : req.body?.code;
    if (!rawCode || typeof rawCode !== 'string') {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'Please enter a valid coupon code.',
      });
    }

    const supabase = createClient(url, key);
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
      message: err?.message || 'Server error during coupon verification.',
    });
  }
}
