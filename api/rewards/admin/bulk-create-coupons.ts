import { getSupabase } from '../../_lib/supabase';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
