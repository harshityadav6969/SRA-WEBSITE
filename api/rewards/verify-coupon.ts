import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// SERVICE ROLE key only — never expose this to the frontend.
// It lives only in Vercel's environment variables / your local .env.
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Verify a code: /api/rewards/verify-coupon?code=SRA4589231
    const code = String(req.query.code || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ ok: false, error: 'Missing code' });
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('code, reward_amount, status')
      .eq('code', code)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ ok: false, error: 'Database error' });
    }
    if (!data) {
      return res.status(404).json({ ok: false, error: 'Code not found' });
    }
    if (data.status === 'used') {
      return res.status(410).json({ ok: false, error: 'Code already redeemed' });
    }

    return res.status(200).json({
      ok: true,
      code: data.code,
      rewardAmount: data.reward_amount,
    });
  }

  if (req.method === 'POST') {
    // Redeem a code: body = { code, name, phone, email }
    const body = req.body || {};
    const code = String(body.code || '').trim().toUpperCase();

    if (!code) {
      return res.status(400).json({ ok: false, error: 'Missing code' });
    }

    // Atomic update: only succeeds if the code is currently 'active'.
    // If two requests race for the same code, only one UPDATE will match
    // a row (since the first one already flips status to 'used'), so the
    // second one gets back zero rows — this is what actually prevents
    // double redemption, unlike the JSON-file version.
    const { data: updated, error: updateError } = await supabase
      .from('coupons')
      .update({ status: 'used' })
      .eq('code', code)
      .eq('status', 'active')
      .select('code, reward_amount')
      .maybeSingle();

    if (updateError) {
      return res.status(500).json({ ok: false, error: 'Database error' });
    }
    if (!updated) {
      // Either the code never existed, or someone already redeemed it
      // (possibly milliseconds ago) — check which, just to give a clean message.
      const { data: existing } = await supabase
        .from('coupons')
        .select('status')
        .eq('code', code)
        .maybeSingle();

      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Code not found' });
      }
      return res.status(410).json({ ok: false, error: 'Code already redeemed' });
    }

    // Log the claim details (best-effort — don't fail the redemption if this errors)
    await supabase.from('claims').insert({
      coupon_code: updated.code,
      customer_name: body.name || null,
      customer_phone: body.phone || null,
      customer_email: body.email || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Redeemed',
      code: updated.code,
      rewardAmount: updated.reward_amount,
    });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}