import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage ayarları
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts', // Cloudinary'de dosyaların kaydedileceği klasör
    allowed_formats: ['jpg', 'jpeg', 'png'], // İzin verilen dosya formatları
  },
});

export { cloudinary, storage };
