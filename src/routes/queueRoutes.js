const express = require('express');
const router = express.Router();

const {
  joinQueue,
  getQueueItems,
  updateQueueStatus
} = require('../controllers/queueController');

const { protect } = require('../middleware/authMiddleware');
const { checkDatabaseConnection } = require('../middleware/dbMiddleware');

router.use(protect);
router.use(checkDatabaseConnection);

router
  .route('/')
  .post(joinQueue)
  .get(getQueueItems);

router.patch('/:id/status', updateQueueStatus);

module.exports = router;
