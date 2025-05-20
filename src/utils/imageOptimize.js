import sharp from "sharp";
import path from 'path'
import cloudinary from "~/config/cloudinary";

/**
 * Optimize and convert images to WebP format.
 * @param {Array} files - Array of file objects containing buffer and original name.
 * @param {number} quality - Quality for WebP conversion (0-100).
 * @param {number} resizeWidth - Optional width to resize the image.
 * @returns {Promise<Array>} - Array of optimized image buffers and original names.
 */
async function optimizeImages(files, quality = 80, resizeWidth = 1200) {
  try {
    return await Promise.all(
      files.map(async (file) => {
        const optimizedBuffer = await sharp(file.buffer)
          .webp({ quality })         // Convert to WebP
          .resize(resizeWidth)       // Resize if specified
          .toBuffer();

        return {
          buffer: optimizedBuffer,
          originalname: file.originalname,
        };
      })
    );
  } catch (error) {
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Upload optimized images to Cloudinary.
 * @param {Array} images - Array of image objects with buffer and original name.
 * @param {string} folderName - Folder name in Cloudinary.
 * @returns {Promise<Array>} - Array of upload results from Cloudinary.
 */
async function uploadImagesToCloudinary(images, folderName = 'LacVietStudio') {
  try {
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderName,
            public_id: `${Date.now()}-${path.parse(image.originalname).name}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(image.buffer);
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

module.exports = {
  optimizeImages,
  uploadImagesToCloudinary,
};
