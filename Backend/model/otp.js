import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10, // 10 minutes TTL
  },

  emailSent: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("OTP", OTPSchema);
