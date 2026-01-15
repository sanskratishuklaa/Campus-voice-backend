const mongoose = require('mongoose');

const queueItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceType: {
      type: String,
      enum: ['technical', 'maintenance', 'library', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['waiting', 'serving', 'completed', 'cancelled'],
      default: 'waiting'
    },
    ticketNumber: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const QueueItem = mongoose.model('QueueItem', queueItemSchema);

module.exports = QueueItem;
