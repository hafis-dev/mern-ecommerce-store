const cloudinary = require("../config/cloudinary");

exports.uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce_products",
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    upload.end(buffer);
  });
};
