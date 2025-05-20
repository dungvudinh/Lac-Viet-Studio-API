// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '~/config/cloudinary';
// import path from 'path';

// // Configure Multer Storage
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         // Extract file name without extension
//         const fileName = path.parse(file.originalname).name;
//         return {
//             folder: 'LacVietStudio', // Cloudinary folder name
//             format: 'png', // Convert all images to PNG
//             public_id: `${Date.now()}-${fileName}`, // Unique file name without extension
//         };
//     },
// });

// const upload = multer({ storage });

// export default upload;
// Change to memory storage
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
export default upload;