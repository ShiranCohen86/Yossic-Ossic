const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'yossic-tutoring/materials',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto',
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('סוג קובץ לא נתמך. מותר: PDF, JPG, PNG, GIF, WEBP'));
  },
});

module.exports = upload;
