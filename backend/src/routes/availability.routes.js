const router = require('express').Router();
const ctrl = require('../controllers/availability.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/open-slots', authenticate, ctrl.getOpenSlots);
router.get('/', authenticate, ctrl.listSlots);
router.post('/', authenticate, authorize('teacher'), ctrl.createSlot);
router.put('/:id', authenticate, authorize('teacher'), ctrl.updateSlot);
router.delete('/:id', authenticate, authorize('teacher'), ctrl.deleteSlot);

module.exports = router;
