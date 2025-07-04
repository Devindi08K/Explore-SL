const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload path based on the route or file type.
    // This provides a basic structure.
    let uploadPath = path.join(__dirname, '../uploads/');

    // Example of dynamic path based on route
    if (req.baseUrl.includes('/affiliate-links')) {
      uploadPath = path.join(__dirname, '../uploads/business-images');
    } else if (req.baseUrl.includes('/blogs')) {
      uploadPath = path.join(__dirname, '../uploads/blogs');
    } else if (req.baseUrl.includes('/vehicles')) {
        uploadPath = path.join(__dirname, '../uploads/vehicles');
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

module.exports = upload;