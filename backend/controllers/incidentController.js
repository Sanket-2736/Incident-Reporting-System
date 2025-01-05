const Incident = require('../models/incident'); // Adjust the path as necessary
const User = require('../models/user');

// Create a new incident
const createIncident = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);

        const { title, description, category, location, username } = req.body;

        // Validate request data
        if (!title || !description || !category || !location || !username) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Create a new incident instance
        const newIncident = new Incident({
            title,
            description,
            category,
            location,
            reporter: username,
            attachments: req.files ? req.files.map(file => file.path) : [], // Attach file paths
        });

        // Save the incident to the database
        const savedIncident = await newIncident.save();

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        // Add the incident to the user's list of incidents
        user.incidents = user.incidents || [];
        user.incidents.push(savedIncident._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Incident created successfully.',
            incident: savedIncident,
        });
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create incident.', 
            details: error.message 
        });
    }
};

// Get all incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find();
        res.status(200).json({
            success: true,
            message: 'All incidents fetched successfully.',
            incidents,
        });
    } catch (error) {
        console.error('Error fetching incidents:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch incidents.' 
        });
    }
};

// Get an incident by ID
const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params;
        const incident = await Incident.findById(id);

        if (!incident) {
            return res.status(404).json({ success: false, error: 'Incident not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Incident fetched successfully.',
            incident,
        });
    } catch (error) {
        console.error('Error fetching incident:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch the incident.' 
        });
    }
};

// Update the status of an incident
const updateStatus = async (req, res) => {
    try {
        const { id: incidentId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid status value. Accepted values are: Pending, In Progress, Resolved, Rejected.' 
            });
        }

        // Find the incident by ID
        const incident = await Incident.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ success: false, error: 'Incident not found.' });
        }

        // Update the status
        incident.statusUpdate = status;
        await incident.save();

        res.status(200).json({
            success: true,
            message: 'Incident status updated successfully.',
        });
    } catch (error) {
        console.error('Error updating incident status:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update incident status.', 
            details: error.message 
        });
    }
};

module.exports = { createIncident, getIncidents, getIncidentById, updateStatus };
