import { claimCoupon } from '../../lib/rewards';
import { sendRealEmail } from '../../lib/email';

function setCors(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCors(res);

  try {
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

    const result = await claimCoupon({
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
    });

    if (!result.success) {
      const status = 'httpStatus' in result ? result.httpStatus || 400 : 400;
      return res.status(status).json(result);
    }

    const now = new Date(result.submittedAt);
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const emailBody = [
      `Reference ID: ${result.referenceId}`,
      `Coupon Code: ${String(rawCode).trim().toUpperCase()}`,
      `Reward: ₹${result.rewardAmount}`,
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
    const subject = `🎉 New SRA Reward Redemption (${String(rawCode).trim().toUpperCase()} - ₹${result.rewardAmount})`;

    sendRealEmail(ADMIN_EMAIL, subject, emailBody).catch((err) => {
      console.error('[EMAIL DISPATCH FAILED]', err);
    });

    return res.json(result);
  } catch (err: any) {
    console.error('[claim]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during claim submission.',
    });
  }
}
