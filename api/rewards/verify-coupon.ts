import { verifyCouponCode } from '../../lib/rewards';

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

    const result = await verifyCouponCode(rawCode);

    if (result.status === 'ERROR') {
      return res.status(result.httpStatus || 500).json({
        success: false,
        message: result.message,
      });
    }

    return res.json(result);
  } catch (err: any) {
    console.error('[verify-coupon]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during coupon verification.',
    });
  }
}
