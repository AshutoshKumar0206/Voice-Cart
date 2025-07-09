require("dotenv").config();
const cloudinary = require("cloudinary").v2; //! Cloudinary is being required
exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});
		cloudinary.api.usage()
            .then(result => console.log("cloudinary connected succesfully"))
            .catch(error => console.error(error));
	} catch (error) {
		res.status(500).json({
			success:false,
			message:"Error in connecting to Cloudinary"
	})
	}
};