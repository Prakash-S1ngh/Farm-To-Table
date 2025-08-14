const cloudinary = require('cloudinary').v2; // Make sure to use Cloudinary v2
const fs = require('fs'); // For file system operations
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.cloudinary_cloud_name, 
  api_key: process.env.cloudinary_apiKey, 
  api_secret: process.env.cloudinary_apiSecret
});

exports.uploadOnCloudinary = async (imagePath, option = {}) => {
  try {
    console.log("Starting Cloudinary upload for:", imagePath);
    console.log("Cloudinary config:", {
      cloud_name: process.env.cloudinary_cloud_name,
      api_key: process.env.cloudinary_apiKey ? 'Set' : 'Not set',
      api_secret: process.env.cloudinary_apiSecret ? 'Set' : 'Not set'
    });
    
    // Merge user-specified options with default options for user display pictures
    const uploadOptions = {
      folder: 'FarmTotable/Users',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' }
      ],
      ...option 
    };

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File does not exist: ${imagePath}`);
    }
    console.log("File exists, proceeding with upload");
    
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, uploadOptions);
    console.log("The image is uploaded on Cloudinary:", result.url);

    // Delete the file from the local directory after successful upload
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Failed to delete the local file:', err);
      } else {
        console.log('Local file successfully deleted');
      }
    });

    return result.url;
  } catch (error) {
    console.log("An error occurred while uploading to Cloudinary:", error);
    throw error;
  }
};
