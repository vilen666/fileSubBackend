// multerConfig.js
const multer = require('multer');
const storage= multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype==='application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only pdfs are allowed'), false);
  }
};
const uploadMulter = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: fileFilter
});

module.exports = uploadMulter;
