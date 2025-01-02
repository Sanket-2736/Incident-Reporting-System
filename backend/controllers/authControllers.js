const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup function
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Updated to match user model fields

        const userExists = await userModel.findOne({ $or: [{ email }] }); // Only check email since username is not in user schema
        if (userExists) {
            return res.json({ success: false, message: 'User with the credentials already exists.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' if role is not provided
        });
        await newUser.save();

        const jwtToken = jwt.sign(
            { _id: newUser._id, role: newUser.role, email: newUser.email },
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        );

        return res.json({
            success: true,
            message: 'Signup successful!',
            token: jwtToken,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            isActive: newUser.isActive, // Optional: include isActive if needed
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'An unexpected error occurred during signup.' });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Updated to use email for login

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Check if the password is correct
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.json({ success: false, message: 'Invalid password.' });
        }

        // Generate JWT token using user details
        const jwtToken = jwt.sign(
            { _id: user._id, role: user.role, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        );

        // Return success response
        return res.json({
            success: true,
            message: 'Login successful!',
            token: jwtToken,
            name: user.name, // Include user's name
            role: user.role,
            email: user.email,
            isActive: user.isActive, // Optional: include isActive if needed
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'An unexpected error occurred during login.' });
    }
};

module.exports = { signup, login };
