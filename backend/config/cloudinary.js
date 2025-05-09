const cloudinary = require('cloudinary').v2;

// Log environment variables (remove in production)
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'API Key is set' : 'API Key is missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'API Secret is set' : 'API Secret is missing'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary; 