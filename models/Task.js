const mongoose = require('mongoose');

// One document in the "tasks" collection
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'done'],
        message: 'status must be pending, in-progress or done'
      },
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
