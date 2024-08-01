const multer = require('multer');
module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.send({success:false,data:'File size is too large. Maximum size is 1MB.'});
      }
    } else if (err) {
      return res.send({success:false,data:err.message});
    }
    else
    next();
  };