const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Ensure this field is present
    role: { type: String, default: 'user' },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    permissions: {
        canReportIncident: { type: Boolean, default: false },
        canViewReports: { type: Boolean, default: false },
        canEditReports: { type: Boolean, default: false },
        canManageUsers: { type: Boolean, default: false }
    },
    dateJoined: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
