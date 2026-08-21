import { getSupabase } from '../../_lib/supabase';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
