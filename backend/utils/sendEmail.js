const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP config error:", error.message);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `"SHOPX STORE" <${process.env.SMTP_EMAIL}>`,
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
