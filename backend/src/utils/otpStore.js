const OTP = require("../models/otp");

exports.saveOTP = async (email, otp) => {
  // Delete any existing OTP for this email
  await OTP.findOneAndDelete({ email });
  // Create a new one (expires automatically via TTL index)
  await OTP.create({ email, otp });
};

exports.verifyOTP = async (email, inputOtp) => {
  const record = await OTP.findOne({ email });
  if (!record) return { valid: false, reason: "OTP not found or expired" };
  if (record.otp !== inputOtp) return { valid: false, reason: "Wrong OTP" };
  
  // one-time use
  await OTP.findOneAndDelete({ email });
  return { valid: true };
};