const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['technical', 'maintenance', 'ragging', 'library', 'other'],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'escalated', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedToRole: {
      type: String,
      default: null
    },
    escalationLevel: {
      type: Number,
      default: 0
    },
    history: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        note: String
      }
    ]
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
