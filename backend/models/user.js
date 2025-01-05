const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ // Basic email regex validation
    },
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
    reportedIncident: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident',
    }],
    
}, { timestamps: true }); 

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
