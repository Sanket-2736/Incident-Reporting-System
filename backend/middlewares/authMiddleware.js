const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    console.log(process.env.SECRET_KEY);    
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next(); 
    } catch (error) {
        console.error('JWT Error:', error); 
        res.status(403).json({ success: false, message: 'Invalid token' }); // Send error response
    }
};

module.exports = protect;
