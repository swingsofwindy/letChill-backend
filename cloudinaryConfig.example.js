// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'your-cloud-name', // Lấy từ dashboard của Cloudinary
    api_key: 'your-api-key',       // Lấy từ dashboard của Cloudinary
    api_secret: 'your-api-secret'   // Lấy từ dashboard của Cloudinary
});

module.exports = cloudinary;
