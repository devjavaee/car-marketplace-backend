const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    reply: {
     type: String,
   },
     repliedAt: {
    type: Date,
   },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
