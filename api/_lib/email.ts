import nodemailer from 'nodemailer';

export async function sendRealEmail(
  toEmail: string,
  subject: string,
  bodyText: string
): Promise<{ sent: boolean; method: string; detail?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || toEmail || 'srashrijiagrigeneticsseeds@gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SRA Rewards Portal <onboarding@resend.dev>',
          to: [adminEmail],
          subject,
          text: bodyText,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return { sent: true, method: 'Resend API' };
      }
      return { sent: false, method: 'Resend API', detail: JSON.stringify(data) };
    } catch (err: any) {
      return { sent: false, method: 'Resend API', detail: err?.message || String(err) };
    }
  }

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"SRA Rewards Portal" <${smtpUser}>`,
        to: adminEmail,
        subject,
        text: bodyText,
      });

      return { sent: true, method: 'SMTP Transporter' };
    } catch (err: any) {
      return { sent: false, method: 'SMTP', detail: err?.message || String(err) };
    }
  }

  return {
    sent: false,
    method: 'DB Log Only',
    detail: 'SMTP_USER and SMTP_PASS not set in environment secrets.',
  };
}
