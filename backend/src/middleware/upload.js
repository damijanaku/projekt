import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

const UPLOAD_DIR = 'uploads/salons';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomUUID() + ext;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, or WebP images are allowed'));
  }
  cb(null, true);
};

export const uploadSalonImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('image');

const uploadGalleryImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
}).array('images', 5);

export const uploadSalonGalleryImages = (req, res, next) => {
  uploadGalleryImages(req, res, (error) => {
    if (!error) return next();
    const uploadedFiles = req.files ?? [];
    Promise.all(uploadedFiles.map((file) => fsPromises.unlink(file.path).catch(() => {})));
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Each image must be 5 MB or smaller'
      : error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'You can upload at most 5 images at a time'
        : error.message;
    return res.status(400).json({ message });
  });
};

