const jwt = require('jsonwebtoken');

exports.generateToken = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    });

    return token;
};