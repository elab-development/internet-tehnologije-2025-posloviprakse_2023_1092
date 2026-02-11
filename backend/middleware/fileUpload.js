import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsDir = path.join(__dirname, '../uploads');
const cvDir = path.join(uploadsDir, 'cvs');
const profilePicDir = path.join(uploadsDir, 'profile-pictures');

[uploadsDir, cvDir, profilePicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});




const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvDir);
  },
  filename: (req, file, cb) => {
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `cv-${req.user.id}-${uniqueSuffix}-${sanitizedFilename}`);
  }
});




const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});




const cvFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nevažeći format fajla. Dozvoljeni formati: PDF, DOC, DOCX'), false);
  }
};




const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nevažeći format slike. Dozvoljeni formati: JPG, PNG, GIF, WEBP'), false);
  }
};





export const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
}).single('cv'); 






export const uploadProfilePicture = multer({
  storage: multer.memoryStorage(), 
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 
  }
}).single('profilePicture');




export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fajl je prevelik. Maksimalna veličina je 5MB za CV i 2MB za profilne slike.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload greška: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};




export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default {
  uploadCV,
  uploadProfilePicture,
  handleUploadError,
  deleteFile
};
