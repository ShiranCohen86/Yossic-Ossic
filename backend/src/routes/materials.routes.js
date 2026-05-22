const router = require('express').Router();
const ctrl = require('../controllers/materials.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');
const v = require('../validators/materials.validator');

router.get('/', authenticate, ctrl.listMaterials);
router.post('/', authenticate, authorize('teacher'), upload.single('file'), ctrl.createMaterial);
router.get('/:id', authenticate, ctrl.getMaterial);
router.patch('/:id', authenticate, authorize('teacher'), validate(v.updateMaterialSchema), ctrl.updateMaterial);
router.delete('/:id', authenticate, authorize('teacher'), ctrl.deleteMaterial);

module.exports = router;
