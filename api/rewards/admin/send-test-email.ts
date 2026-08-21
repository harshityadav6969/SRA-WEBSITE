import { sendRealEmail } from '../../_lib/email';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'srashrijiagrigeneticsseeds@gmail.com';
  const subject = '🧪 Test Email Dispatch from SRA Rewards Portal';
  const bodyText = `Hello Admin,\n\nThis is a test notification email sent to ${adminEmail} from SRA Rewards Portal.\n\nTimestamp: ${new Date().toLocaleString()}\n\nAll email notifications for new coupon redemptions will be dispatched to this address.`;

  const result = await sendRealEmail(adminEmail, subject, bodyText);

  return res.json({
    success: true,
    recipient: adminEmail,
    dispatchResult: result,
    message: result.sent
      ? `Test email sent successfully to ${adminEmail} via ${result.method}!`
      : `Email could not be delivered to ${adminEmail}. (${result.detail || 'Configure SMTP_USER/SMTP_PASS for external inbox delivery'})`,
  });
}
