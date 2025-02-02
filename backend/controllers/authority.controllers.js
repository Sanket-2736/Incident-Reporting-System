const incidentModel = require('../models/incident.model')
const User = require('../models/user.model')
const reportModel = require('../models/report.model');
const mongoose = require('mongoose');

exports.getIncidentById = async (req, res) => {
    const incidentId = req.params.id;

    try {
        const incident = incidentModel.findById(incidentId);

        if(!incident){
            return res.status(404).json({ message: 'Incident not found' });
        }

        return res.json({
            incident: incident,
            message : "Fetched event"
        })
    } catch (error) {
        console.log("Error in fetching incident by ID: ", error);
        return res.json({
            message: "Error in fetching incident by ID",
            success : false,
        })
    }
}

exports.viewIncidents = async (req, res) => {
    try {
        const incidents = await incidentModel.find({});
        console.log(incidents);        
        return res.json({
            message : "Incidents fetched!",
            data : incidents,
            success : true
        });
    } catch (error) {
        console.log("Error fetching incidents",  error);
        return res.status(500).json({
            message : "Error fetching incidents",
            success : false
        });        
    }
}

exports.markIncidentAsSolved = async (req, res) => {
    try {
        const incidentId = req.params.id;

        const incident = await incidentModel.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ message: "Incident not found.", success: false });
        }

        if (incident.status === 'resolved') {
            return res.status(400).json({ message: "Incident is already resolved.", success: false });
        }

        incident.status = 'resolved';
        await incident.save();

        const report = new reportModel({
            title: incident.title,
            description: incident.description,
            reportedBy: incident.reportedBy,
            status: 'resolved',
            severity: incident.severity,
            location: incident.location,
            incident: incident._id,
            attachments: incident.image,
        });

        await report.save();

        const reportedBy = await User.findById(incident.reportedBy);

        const msg = `The case "${incident.title}" is resolved. Please check the reports section.`;
        if (reportedBy && reportedBy.notifications) {
            reportedBy.notifications.push({
                text: msg,
                incidentId: incidentId,
            });
            await reportedBy.save();
        }

        return res.json({
            message: "Incident marked as resolved, and report generated.",
            success: true,
            updatedIncident: incident,
            generatedReport: report,
        });
        
    } catch (error) {
        console.error("Error marking incident as resolved:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user by ID
        const user = await User.findById(userId).lean(); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        const filteredUser = {
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            address: user.address,
            profilePic: user.profilePic,
            email: user.email,
            role: user.role,
        };

        console.log(filteredUser);        

        return res.status(200).json({
            success: true,
            user: filteredUser,
        });
    } catch (error) {
        console.error("Error in fetching user: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.updateIncident = async (req, res) => {
    try {
        const { message } = req.body; 
        const incidentId = req.params.id;

        console.log("Message: ", message, "IncidentId: ", incidentId);

        // Validate incident ID
        if (!mongoose.Types.ObjectId.isValid(incidentId)) {
            return res.status(400).json({
                message: "Invalid incident ID.",
                success: false,
            });
        }

        // Validate message
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                message: "Message must be a non-empty string.",
                success: false,
            });
        }

        // Find and update the incident
        const updatedIncident = await incidentModel.findByIdAndUpdate(
            incidentId,
            { $push: { messages: { text: message, date: new Date() } } }, // Ensure 'messages' field exists in Schema
            { new: true }
        );

        if (!updatedIncident) {
            return res.status(404).json({
                message: "Incident not found.",
                success: false,
            });
        }

        // Ensure incident has a valid reporter
        if (!updatedIncident.reportedBy) {
            return res.status(400).json({
                message: "Incident reporter not found.",
                success: false,
            });
        }

        // Find reporter
        const incidentReporter = await User.findById(updatedIncident.reportedBy);
        if (!incidentReporter) {
            return res.status(404).json({
                message: "Reporter not found.",
                success: false,
            });
        }

        // Update notifications
        incidentReporter.notifications.push({
            text: message,
            incidentId: incidentId,
        });

        await incidentReporter.save();

        return res.json({
            message: "Incident updated successfully!",
            success: true,
            updatedIncident,
        });
    } catch (error) {
        console.error("Error in updating incident:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};