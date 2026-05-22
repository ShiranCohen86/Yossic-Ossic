const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/availability', require('./availability.routes'));
router.use('/lessons', require('./lessons.routes'));
router.use('/materials', require('./materials.routes'));
router.get('/health', (req, res) => res.json({ status: 'ok' }));
module.exports = router;
