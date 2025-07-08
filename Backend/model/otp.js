const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/emailVerificationTemplate")

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
		expires: 60 * 5, // OTP will expire after 5 minutes
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		// console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		// console.log("Error occurred while sending email: ", error);
		throw error;
	}
}
OTPSchema.add({
	emailSent: { type: Boolean, default: false },
})

// Define a post-save hook to send email after the document has been saved
OTPSchema.post("save", async function (next) {
    // Check if this is a new document and if the email has not been sent yet
	if (this.isNew && !this.emailSent) {
		await sendVerificationEmail(this.email, this.otp);
		this.emailSent = true;
		await this.save();
	}
});

const OTP = mongoose.model("otp", OTPSchema);

module.exports = OTP;