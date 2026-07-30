import pkg from 'pg';
import nodemailer from 'nodemailer';

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, source } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const result = await pool.query(
      `INSERT INTO contacts (full_name, company, email, phone, service, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['WhatsApp Visitor', '—', '—', '—', 'WhatsApp Chat', message]
    );
    const msgId = result.rows[0].id;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New WhatsApp Message — "${message.slice(0, 50)}${message.length > 50 ? '…' : ''}"`,
      html: `
        <h2>New WhatsApp Message</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">From</td><td style="padding:8px 12px;border:1px solid #ddd;">Website Visitor (WhatsApp Widget)</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Message</td><td style="padding:8px 12px;border:1px solid #ddd;">${message}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Replied via</td><td style="padding:8px 12px;border:1px solid #ddd;"><a href="https://wa.me/923089226026">Reply on WhatsApp</a></td></tr>
        </table>
        <p style="color:#666;font-size:13px;">To reply, open WhatsApp and send a message to this visitor.</p>
      `,
    });

    res.status(200).json({ success: true, id: msgId });
  } catch (err) {
    console.error('WhatsApp API error:', err);
    res.status(500).json({ error: 'Failed to send. Try again.' });
  }
};
