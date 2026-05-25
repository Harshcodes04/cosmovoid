const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.transporter = transporter; // shared with contactController

exports.sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Cosmovoid" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Cosmovoid verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0a0a0a;color:#e4e4e7;border-radius:16px;border:1px solid #27272a">
        <h2 style="margin:0 0 8px;font-size:22px;color:#fff">Verify your email</h2>
        <p style="margin:0 0 24px;color:#a1a1aa;font-size:14px">Use the code below to complete your Cosmovoid signup. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
        <div style="text-align:center;padding:24px;background:#18181b;border-radius:12px;letter-spacing:0.3em;font-size:32px;font-weight:700;color:#67e8f9">${otp}</div>
        <p style="margin:24px 0 0;font-size:12px;color:#52525b">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Cosmovoid" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your Cosmovoid password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0a0a0a;color:#e4e4e7;border-radius:16px;border:1px solid #27272a">
        <h2 style="margin:0 0 8px;font-size:22px;color:#fff">Password reset</h2>
        <p style="margin:0 0 24px;color:#a1a1aa;font-size:14px">Use the code below to reset your password. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
        <div style="text-align:center;padding:24px;background:#18181b;border-radius:12px;letter-spacing:0.3em;font-size:32px;font-weight:700;color:#f97316">${otp}</div>
        <p style="margin:24px 0 0;font-size:12px;color:#52525b">If you didn't request a password reset, your account is safe — just ignore this email.</p>
      </div>
    `,
  });
};

