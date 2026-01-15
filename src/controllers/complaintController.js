const Complaint = require('../models/complaintModel');
const Notification = require('../models/notificationModel');
const {
  TECHNICAL_TEAM,
  MAINTENANCE_TEAM,
  ANTI_RAGGING,
  LIBRARY_TEAM,
  STUDENT
} = require('../utils/roles');

const mapCategoryToRole = (category) => {
  switch (category) {
    case 'technical':
      return TECHNICAL_TEAM;
    case 'maintenance':
      return MAINTENANCE_TEAM;
    case 'ragging':
      return ANTI_RAGGING;
    case 'library':
      return LIBRARY_TEAM;
    default:
      return null;
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const assignedToRole = mapCategoryToRole(category);

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
      assignedToRole,
      history: [{ status: 'open', note: 'Complaint created' }]
    });

    await Notification.create({
      user: req.user._id,
      title: 'Complaint submitted',
      message: `Your complaint "${complaint.title}" has been created.`,
      type: 'complaint',
      relatedComplaint: complaint._id
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (req.user.role === STUDENT) {
      filter.createdBy = req.user._id;
    } else {
      filter.assignedToRole = req.user.role;
    }

    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (
      req.user.role === STUDENT &&
      complaint.createdBy._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You cannot view this complaint');
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (
      complaint.createdBy.toString() !== req.user._id.toString() ||
      complaint.status !== 'open'
    ) {
      res.status(403);
      throw new Error('You cannot edit this complaint');
    }

    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (priority) complaint.priority = priority;

    complaint.history.push({
      status: complaint.status,
      note: 'Complaint updated by student'
    });

    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (complaint.assignedToRole !== req.user.role) {
      res.status(403);
      throw new Error('You cannot update this complaint');
    }

    if (status) {
      complaint.status = status;
      if (status === 'escalated') {
        complaint.escalationLevel += 1;
      }
    }

    complaint.history.push({
      status: complaint.status,
      note: note || 'Status updated by staff'
    });

    const updated = await complaint.save();

    await Notification.create({
      user: complaint.createdBy,
      title: 'Complaint status updated',
      message: `Your complaint "${complaint.title}" status is now "${complaint.status}".`,
      type: 'complaint',
      relatedComplaint: complaint._id
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (
      complaint.createdBy.toString() !== req.user._id.toString() ||
      complaint.status !== 'open'
    ) {
      res.status(403);
      throw new Error('You cannot delete this complaint');
    }

    await complaint.deleteOne();

    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
};
