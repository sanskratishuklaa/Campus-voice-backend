const express = require('express');
const router = express.Router();

const { getOverview } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { checkDatabaseConnection } = require('../middleware/dbMiddleware');
const {
  ADMIN,
  TECHNICAL_TEAM,
  MAINTENANCE_TEAM,
  ANTI_RAGGING,
  LIBRARY_TEAM
} = require('../utils/roles');

router.get(
  '/overview',
  protect,
  checkDatabaseConnection,
  authorizeRoles(ADMIN, TECHNICAL_TEAM, MAINTENANCE_TEAM, ANTI_RAGGING, LIBRARY_TEAM),
  getOverview
);

module.exports = router;
