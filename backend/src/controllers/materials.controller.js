const Material = require('../models/Material');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const listMaterials = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.topic) filter.topic = new RegExp(req.query.topic, 'i');
    if (req.query.grade) filter.gradeLevel = parseInt(req.query.grade, 10);
    if (req.query.q) filter.$text = { $search: req.query.q };
    const materials = await Material.find(filter).sort({ createdAt: -1 });
    res.json({ materials });
  } catch (err) { next(err); }
};

const createMaterial = async (req, res, next) => {
  try {
    const data = { ...req.body, uploadedBy: req.user._id };
    if (req.file) {
      data.fileUrl = req.file.path;
      data.publicId = req.file.filename;
      data.fileName = req.file.originalname;
      data.fileSize = req.file.size;
      data.fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }
    if (!data.fileUrl) throw new ApiError(400, 'קובץ או קישור נדרש');
    const material = await Material.create(data);
    res.status(201).json({ material });
  } catch (err) { next(err); }
};

const getMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, isActive: true });
    if (!material) throw new ApiError(404, 'חומר לא נמצא');
    res.json({ material });
  } catch (err) { next(err); }
};

const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!material) throw new ApiError(404, 'חומר לא נמצא');
    res.json({ material });
  } catch (err) { next(err); }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) throw new ApiError(404, 'חומר לא נמצא');
    if (material.publicId) {
      await cloudinary.uploader.destroy(material.publicId, { resource_type: 'auto' });
    }
    material.isActive = false;
    await material.save();
    res.json({ message: 'החומר נמחק בהצלחה' });
  } catch (err) { next(err); }
};

module.exports = { listMaterials, createMaterial, getMaterial, updateMaterial, deleteMaterial };
