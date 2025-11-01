const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  patternType: {
    type: String,
    enum: ['fibonacci', 'sine_wave', 'exponential', 'unknown'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  dataPoints: {
    type: Number
  },
  summary: {
    min: Number,
    max: Number,
    avg: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pattern', patternSchema);