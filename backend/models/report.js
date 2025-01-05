// models/Report.js
const mongoose = require('mongoose');

// Define the Report Schema
const reportSchema = new mongoose.Schema({
  incident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  findings: {
    type: String,
    trim: true,
  },
  resolution: {
    type: String,
    trim: true,
  },
  statusUpdate: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], // Matches Incident status
    required: true,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the updatedAt field
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); 
  next();
});

// Export the Report Model
module.exports = mongoose.model('Report', reportSchema);
