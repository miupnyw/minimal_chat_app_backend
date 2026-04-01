const { Router } = require('express');
const authRoutes = require('./auth');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);

module.exports = router;
