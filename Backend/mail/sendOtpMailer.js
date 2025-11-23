import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpTemplate from "./emailVerificationTemplate.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default async function sendOtpMail(email, otp, name = "") {
  const html = otpTemplate(otp); // generate HTML with OTP

  const msg = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "OTP Verification",
    html,
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log("Mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}
