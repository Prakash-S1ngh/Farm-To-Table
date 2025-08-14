const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use relative path for uploads folder
    const uploadPath = path.join(__dirname, 'imagesForconfig');
    console.log("Multer destination:", uploadPath);
    
    // Check if directory exists and is writable
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      console.log("Creating upload directory:", uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix;
    console.log("Multer filename:", filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    console.log("File accepted:", file.originalname, file.mimetype);
    cb(null, true);
  } else {
    console.log("File rejected:", file.originalname, file.mimetype);
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
module.exports = upload;
