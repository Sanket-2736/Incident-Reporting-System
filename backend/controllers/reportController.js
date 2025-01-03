const Report = require('../models/report'); // Adjust the path to your Report model
const multer = require('multer');
const path = require('path');

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage });

// Function to create a new report
exports.createReport = [
    upload.single('image'), // Middleware for handling image upload
    async (req, res) => {
        try {
            const { title, description, location, statusUpdate, incident } = req.body;

            // Validate required fields
            if (!title || !description || !location || !statusUpdate || !incident) {
                return res.status(400).json({ message: 'Title, description, location, statusUpdate, and incident are required.', success: false });
            }

            if (!req.user || !req.user._id) {
                console.error('User is not authenticated or user ID is missing.');
                return res.status(401).json({ message: 'User not authenticated', success: false });
            }

            const image = req.file ? req.file.path : null; // Get the image path if uploaded

            const newReport = new Report({
                incident: incident, // Ensure the incident ID is provided
                createdBy: req.user._id, // Set the creator of the report to the authenticated user
                description,
                statusUpdate, // Include the status update
                findings: null, // Optional field, set to null if not provided
                resolution: null, // Optional field, set to null if not provided
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            const savedReport = await newReport.save();
            res.status(201).json({
                message: 'Report created successfully.',
                data: savedReport,
                success: true
            });
        } catch (error) {
            console.error('Error creating report:', error); // Log error for debugging
            res.status(500).json({ message: 'Error creating report', success: false });
        }
    }
];



// Function to get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find(); // Fetch all reports from the database
        res.status(200).json({ success: true, data: reports }); // Send the reports back as a JSON response
    } catch (error) {
        console.error('Error fetching reports:', error); // Log error for debugging
        res.status(500).json({ message: 'Error fetching reports', error });
    }
};

// Function to get a report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id); // Find report by ID
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        res.json({ success: true, message: "Report fetched!", data: report });
    } catch (error) {
        console.error('Error fetching report:', error); // Log error for debugging
        res.status(500).json({ message: 'Error fetching report', error });
    }
};

// Function to update an existing report
exports.updateReport = async (req, res) => {
    const reportId = req.params.id; // Get the report ID from the URL parameter
    const updatedData = req.body; // Get the updated data from the request body

    try {
        const updatedReport = await Report.findByIdAndUpdate(reportId, updatedData, { new: true });

        if (!updatedReport) {
            return res.status(404).json({ success: false, message: 'Report not found.' });
        }

        res.status(200).json({ success: true, message: "Report updated", report: updatedReport });
    } catch (error) {
        console.error('Error updating report:', error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error updating report', error });
    }
};

// Function to solve a case (update status and response message)
exports.solveCase = async (req, res) => {
    const reportId = req.params.id; // Get the report ID from the URL parameter
    const { status, responseMessage } = req.body; // Get status and response from the request body

    // Validate input
    if (!status || !responseMessage) {
        return res.status(400).json({ success: false, message: 'Status and response message are required.' });
    }

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status, response: responseMessage }, // Assuming you have a 'response' field in your report model
            { new: true } // Return the updated report
        );

        if (!updatedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.status(200).json({ success: true, message: "Case solved!", report: updatedReport });
    } catch (error) {
        console.error('Error updating report:', error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error updating report', error });
    }
};

// Function to create a new report by admin
exports.createAdminReport = async (req, res) => {
    try {
        const { title, description, location } = req.body;

        // Validate required fields
        if (!title || !description || !location) {
            return res.status(400).json({ success: false, message: 'Title, description, and location are required.' });
        }

        const newReport = new Report({
            title,
            description,
            location,
            image: req.body.image, // You can add logic for image upload if using multer
            user: req.user._id, // Assuming user ID is available in req.user
            status: 'Pending', // Default status for new reports
        });

        const savedReport = await newReport.save();
        res.status(201).json({ success: true, message: "Report created!", report: savedReport });
    } catch (error) {
        console.error('Error creating admin report:', error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error creating admin report', error });
    }
};
