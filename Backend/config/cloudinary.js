import cloudinary from "cloudinary";

export const cloudinaryConnect = () => {
  try {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    cloudinary.v2.api
      .usage()
      .then(() => console.log("Cloudinary connected successfully"))
      .catch((error) => console.error("Cloudinary connection error:", error));
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error.message);
  }
};
