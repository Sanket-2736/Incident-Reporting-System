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
            const { title, description, location } = req.body;

            // Validate required fields
            if (!title || !description || !location) {
                return res.status(400).json({ message: 'Title, description, and location are required.' });
            }

            const image = req.file ? req.file.path : null; // Get the image path if uploaded

            const newReport = new Report({
                title,
                description,
                location,
                image,
                user: req.user._id, // Assuming user ID is available in req.user
            });

            const savedReport = await newReport.save();
            res.status(201).json(savedReport);
        } catch (error) {
            console.error('Error creating report:', error); // Log error for debugging
            res.status(500).json({ message: 'Error creating report', error });
        }
    }
];

// Function to get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find(); // Fetch all reports from the database
        res.status(200).json(reports); // Send the reports back as a JSON response
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
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
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
            return res.status(404).json({ message: 'Report not found.' });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error); // Log error for debugging
        res.status(500).json({ message: 'Error updating report', error });
    }
};

// Function to solve a case (update status and response message)
exports.solveCase = async (req, res) => {
    const reportId = req.params.id; // Get the report ID from the URL parameter
    const { status, responseMessage } = req.body; // Get status and response from the request body

    // Validate input
    if (!status || !responseMessage) {
        return res.status(400).json({ message: 'Status and response message are required.' });
    }

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status, response: responseMessage }, // Assuming you have a 'response' field in your report model
            { new: true } // Return the updated report
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error); // Log error for debugging
        res.status(500).json({ message: 'Error updating report', error });
    }
};

// Function to create a new report by admin
exports.createAdminReport = async (req, res) => {
    try {
        const { title, description, location } = req.body;

        // Validate required fields
        if (!title || !description || !location) {
            return res.status(400).json({ message: 'Title, description, and location are required.' });
        }

        const newReport = new Report({
            title,
            description,
            location,
            image: req.body.image, // You can add logic for image upload if using multer
            user: req.user._id, // Assuming user ID is available in req.user
            status: 'Pending', // Default status for new reports
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error creating admin report:', error); // Log error for debugging
        res.status(500).json({ message: 'Error creating admin report', error });
    }
};
