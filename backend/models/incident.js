const Incident = require('../models/incident'); // Make sure this path is correct

// Create a new incident
const createIncident = async (req, res) => {
    try {
        const { title, description, category, location, reporter, attachments } = req.body;

        const newIncident = new Incident({
            title,
            description,
            category,
            location,
            reporter,
            attachments,
        });

        await newIncident.save();

        return res.status(201).json({
            success: true,
            message: 'Incident created successfully!',
            incident: newIncident,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the incident.' });
    }
};

// Get all incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('reporter', 'name email'); // Populate reporter details

        return res.status(200).json({
            success: true,
            incidents,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching incidents.' });
    }
};

module.exports = { createIncident, getIncidents };
