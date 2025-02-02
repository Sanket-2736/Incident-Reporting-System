const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
    },
    image : {
        type : String,
        require : true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'high',
    },
    status: {
        type: String,
        enum: ['reported', 'under review', 'resolved', 'dismissed'],
        default: 'reported',
    },
    message: [
        {
            text: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

module.exports = mongoose.model('Incident', incidentSchema);
