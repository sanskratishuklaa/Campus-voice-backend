const User = require('../models/userModel');
const Complaint = require('../models/complaintModel');
const QueueItem = require('../models/queueModel');

const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();

    const complaintsByStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const queueByService = await QueueItem.aggregate([
      {
        $group: {
          _id: '$serviceType',
          waiting: {
            $sum: {
              $cond: [{ $eq: ['$status', 'waiting'] }, 1, 0]
            }
          },
          serving: {
            $sum: {
              $cond: [{ $eq: ['$status', 'serving'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalComplaints,
      complaintsByStatus,
      queueByService
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview };
