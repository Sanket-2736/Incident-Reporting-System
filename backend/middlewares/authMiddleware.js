// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Ensure SECRET_KEY is set in your environment
        req.user = decoded; // Make sure decoded has the user ID
        next();
    } catch (error) {
        console.error('JWT Error:', error);
        res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = { protect }; // Make sure to export it correctly
