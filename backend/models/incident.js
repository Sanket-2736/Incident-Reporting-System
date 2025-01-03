const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    reporter: { type: String, required: true },
    attachments: [String],
});

module.exports = mongoose.model('Incident', incidentSchema);
