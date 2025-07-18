const cloudinary = require('../config/cloudinaryConfig');

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Explore-SL', // Optional: specify a folder in Cloudinary
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

module.exports = uploadToCloudinary;
