import { getSupabase } from './supabase';

export type VerifyResult =
  | { success: true; status: 'VALID'; message: string }
  | { success: false; status: 'INVALID' | 'REDEEMED'; message: string }
  | { success: false; status: 'ERROR'; message: string; httpStatus?: number };

export async function verifyCouponCode(rawCode: string): Promise<VerifyResult> {
  const code = rawCode.trim().toUpperCase();
  const supabase = getSupabase();

  if (!supabase) {
    return {
      success: false,
      status: 'ERROR',
      message: 'Rewards database is not configured on the server.',
      httpStatus: 500,
    };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('code, reward_amount, status')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return { success: false, status: 'ERROR', message: 'Database error', httpStatus: 500 };
  }

  if (!data) {
    return { success: false, status: 'INVALID', message: 'Invalid Coupon Code' };
  }

  if (data.status === 'used' || data.status === 'redeemed') {
    return {
      success: false,
      status: 'REDEEMED',
      message: 'This coupon has already been redeemed.',
    };
  }

  return {
    success: true,
    status: 'VALID',
    message: 'Coupon Verified Successfully. Please complete your details to reveal your reward.',
  };
}

export interface ClaimInput {
  code: string;
  retailerName: string;
  shopName: string;
  distributor: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  phone: string;
  email?: string;
  gst?: string;
  shopPhoto?: string | null;
}

export type ClaimResult =
  | {
      success: true;
      referenceId: string;
      rewardAmount: number;
      submittedAt: string;
      message: string;
    }
  | { success: false; status?: 'INVALID' | 'REDEEMED'; message: string; httpStatus?: number };

export async function claimCoupon(input: ClaimInput): Promise<ClaimResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      message: 'Rewards database is not configured on the server.',
      httpStatus: 500,
    };
  }

  const code = input.code.trim().toUpperCase();
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
    return { success: false, message: 'Database error', httpStatus: 500 };
  }

  if (!updated) {
    const { data: existing } = await supabase
      .from('coupons')
      .select('status')
      .eq('code', code)
      .maybeSingle();

    if (!existing) {
      return {
        success: false,
        status: 'INVALID',
        message: 'Invalid Coupon Code',
        httpStatus: 400,
      };
    }

    return {
      success: false,
      status: 'REDEEMED',
      message: 'This coupon has already been redeemed.',
      httpStatus: 400,
    };
  }

  const fullClaim = {
    coupon_code: updated.code,
    customer_name: String(input.retailerName).trim(),
    customer_phone: String(input.phone).trim(),
    customer_email: input.email ? String(input.email).trim() : null,
    shop_name: String(input.shopName).trim(),
    distributor: String(input.distributor).trim(),
    village: String(input.village).trim(),
    tehsil: input.tehsil ? String(input.tehsil).trim() : null,
    district: String(input.district).trim(),
    state: String(input.state).trim(),
    gst: input.gst ? String(input.gst).trim() : null,
    shop_photo: input.shopPhoto || null,
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

  return {
    success: true,
    referenceId,
    rewardAmount: updated.reward_amount,
    submittedAt: now.toISOString(),
    message: 'Your coupon has been redeemed successfully.',
  };
}
