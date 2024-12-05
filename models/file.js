const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  // Add this if you implement authentication
  // uploaderId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }
});

module.exports = mongoose.model('File', fileSchema);