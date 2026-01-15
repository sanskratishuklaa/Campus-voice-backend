const express = require('express');
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');
const { checkDatabaseConnection } = require('../middleware/dbMiddleware');

router.use(protect);
router.use(checkDatabaseConnection);

router
  .route('/')
  .post(createComplaint)
  .get(getComplaints);

router
  .route('/:id')
  .get(getComplaintById)
  .put(updateComplaint)
  .delete(deleteComplaint);

router.patch('/:id/status', updateComplaintStatus);

module.exports = router;
