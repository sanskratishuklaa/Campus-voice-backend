const QueueItem = require('../models/queueModel');
const Notification = require('../models/notificationModel');
const {
  TECHNICAL_TEAM,
  MAINTENANCE_TEAM,
  LIBRARY_TEAM,
  STUDENT
} = require('../utils/roles');

const joinQueue = async (req, res, next) => {
  try {
    const { serviceType } = req.body;

    const lastItem = await QueueItem.findOne({ serviceType })
      .sort({ ticketNumber: -1 })
      .select('ticketNumber');

    const nextTicket = lastItem ? lastItem.ticketNumber + 1 : 1;

    const queueItem = await QueueItem.create({
      user: req.user._id,
      serviceType,
      ticketNumber: nextTicket
    });

    res.status(201).json(queueItem);
  } catch (error) {
    next(error);
  }
};

const getQueueItems = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === STUDENT) {
      filter.user = req.user._id;
      filter.status = { $in: ['waiting', 'serving'] };
    } else {
      let serviceType;
      if (req.user.role === TECHNICAL_TEAM) serviceType = 'technical';
      else if (req.user.role === MAINTENANCE_TEAM) serviceType = 'maintenance';
      else if (req.user.role === LIBRARY_TEAM) serviceType = 'library';

      if (serviceType) {
        filter.serviceType = serviceType;
        filter.status = 'waiting';
      }
    }

    const items = await QueueItem.find(filter)
      .populate('user', 'name email')
      .sort({ ticketNumber: 1 });

    res.json(items);
  } catch (error) {
    next(error);
  }
};

const updateQueueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await QueueItem.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!item) {
      res.status(404);
      throw new Error('Queue item not found');
    }

    if (req.user.role === STUDENT) {
      res.status(403);
      throw new Error('Students cannot change queue status');
    }

    item.status = status || item.status;
    const updated = await item.save();

    await Notification.create({
      user: item.user._id,
      title: 'Queue status updated',
      message: `Your ticket #${item.ticketNumber} for ${item.serviceType} is now "${item.status}".`,
      type: 'queue'
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = { joinQueue, getQueueItems, updateQueueStatus };
