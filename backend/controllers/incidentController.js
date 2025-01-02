const Incident = require('../models/incident'); // Adjust the path as necessary

const createIncident = async (req, res) => {
    try {
        const { title, description, category, location, reporter, attachments } = req.body;

        // Validate request data
        if (!title || !description || !category || !location || !reporter) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new incident instance
        const newIncident = new Incident({
            title,
            description,
            category,
            location,
            reporter,
            attachments,
        });

        // Save the incident to the database
        const savedIncident = await newIncident.save();
        res.status(201).json(savedIncident);
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(500).json({ error: 'Failed to create incident' });
    }
};

// Get all incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find();
        res.status(200).json(incidents);
    } catch (error) {
        console.error('Error fetching incidents:', error);
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
};

module.exports = { createIncident, getIncidents };
