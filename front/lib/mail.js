import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Anti-Theft System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
