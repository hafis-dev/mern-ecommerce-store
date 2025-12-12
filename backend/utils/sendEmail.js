const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `"MERN Shop" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email Error:", err.message);
    throw new Error("Email could not be sent");
  }
};
