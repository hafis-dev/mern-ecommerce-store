const cloudinary = require("../config/cloudinary");

exports.uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "ecommerce_products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    upload.end(buffer);
  });
};
