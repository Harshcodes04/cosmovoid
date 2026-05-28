const asyncHandler = require("../utils/asyncHandler");
const transporter  = require("../utils/mailer").transporter;

exports.sendContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "All fields are required" });

  await transporter.sendMail({
    from: `"Cosmovoid Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,          
    subject: `[Contact] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#0a0a0a;color:#e4e4e7;border-radius:16px;border:1px solid #27272a">
        <h2 style="margin:0 0 4px;font-size:20px;color:#fff">New contact message</h2>
        <p style="margin:0 0 24px;color:#71717a;font-size:13px">via cosmovoid.space/contact</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#71717a;width:80px">Name</td><td style="padding:8px 0;color:#fff">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a">Email</td><td style="padding:8px 0;color:#67e8f9">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a">Subject</td><td style="padding:8px 0;color:#fff">${subject}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#18181b;border-radius:10px;font-size:14px;line-height:1.7;color:#d4d4d8;white-space:pre-wrap">${message}</div>
      </div>
    `,
  });

  res.json({ message: "Message sent" });
});
