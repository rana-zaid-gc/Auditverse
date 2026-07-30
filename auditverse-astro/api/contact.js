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
    const { fullName, company, email, phone, service, message } = req.body;
    if (!fullName || !company || !email || !phone) {
      return res.status(400).json({ error: 'Full name, company, email, and phone are required.' });
    }

    const result = await pool.query(
      `INSERT INTO contacts (full_name, company, email, phone, service, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [fullName, company, email, phone, service || '', message || '']
    );
    const contactId = result.rows[0].id;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Form Submission — ${fullName} (${company})`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${contactId}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${fullName}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Company</td><td style="padding:8px 12px;border:1px solid #ddd;">${company}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Email</td><td style="padding:8px 12px;border:1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Phone</td><td style="padding:8px 12px;border:1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Service</td><td style="padding:8px 12px;border:1px solid #ddd;">${service || '—'}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:700;border:1px solid #ddd;">Message</td><td style="padding:8px 12px;border:1px solid #ddd;">${message || '—'}</td></tr>
        </table>
      `,
    });

    res.status(200).json({ success: true, id: contactId });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};
