import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '~/config/cloundinary';
// Configure Multer Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder name
        format: async (req, file) => 'png', // Convert all images to PNG
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
    },
});

const upload = multer({ storage });

export default upload;
