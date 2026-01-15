const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');
const { checkDatabaseConnection } = require('../middleware/dbMiddleware');

router.use(protect);
router.use(checkDatabaseConnection);

router.get('/', getNotifications);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;
