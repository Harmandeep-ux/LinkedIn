import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filePath) {
      return null;
    }

    // Upload the image
    const uploadResult = await cloudinary.uploader.upload(filePath);

    // Delete file only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);

    // Try deleting the file only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw err; // Re-throw so the calling function knows it failed
  }
};

export default uploadOnCloudinary;
