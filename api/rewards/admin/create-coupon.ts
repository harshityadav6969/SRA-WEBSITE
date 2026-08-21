import { getSupabase } from '../../_lib/supabase';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
