const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const multer = require('multer'); // Import multer
const {
  createIncident,
  getIncidents,
  updateStatus,
  getIncidentById,
} = require('../controllers/incidentController'); // Adjust path as necessary
const { protect } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const responderMiddleware = require('../middlewares/responderMiddleware');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage or configure disk storage
});

// Route to create a new incident
router.post(
  '/create',
  protect,
  upload.single('attachments'), // Use the upload middleware here
  asyncHandler(async (req, res) => {
    const incident = await createIncident(req); // Moved logic entirely to the controller
    res.status(201).json({ success: true, data: incident });
  })
);

// Route to update incident status by ID (Responder access required)
router.put(
  '/update-status/:id', // Changed to PUT for updating
  protect,
  responderMiddleware,
  asyncHandler(async (req, res) => {
    const updatedIncident = await updateStatus(req.params.id, req.body); // Ensure this function exists
    res.status(200).json({ success: true, data: updatedIncident });
  })
);

// Route to list all incidents (Admin access required)
router.get(
  '/list',
  protect,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const incidents = await getIncidents(req.query); // Pass query params if needed
    res.status(200).json({ success: true, data: incidents });
  })
);

// Route to list incidents for authorities (Responder access required)
router.get(
  '/list-for-authority',
  protect,
  responderMiddleware,
  asyncHandler(async (req, res) => {
    const incidents = await getIncidents(req.query); // Same controller reused
    res.status(200).json({ success: true, data: incidents });
  })
);

// Route to get a specific incident by ID
router.get(
  '/incident/:id',
  protect,
  asyncHandler(async (req, res) => {
    const incident = await getIncidentById(req.params.id);
    res.status(200).json({ success: true, data: incident });
  })
);

module.exports = router;
