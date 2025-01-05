const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup function
const signup = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, role, phone } = req.body; // Updated to match user model fields

        const userExists = await userModel.findOne({ $or: [{ email }, { username }] }); // Check for existing email or username
        if (userExists) {
            return res.json({ success: false, message: 'User with the credentials already exists.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' if role is not provided
            phone, // Include phone number
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
            username: newUser.username, // Include username
            firstName: newUser.firstName, // Include first name
            lastName: newUser.lastName, // Include last name
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
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Debug logs to check the user object and password
        console.log('Retrieved user:', user);
        console.log('Provided password:', password);
        console.log('Stored hashed password:', user.password);

        // Ensure password is provided
        if (!password) {
            return res.json({ success: false, message: 'Password is required.' });
        }

        // Check if the password is correct
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.json({ success: false, message: 'Invalid password.' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { _id: user._id, role: user.role, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        );

        return res.json({
            success: true,
            message: 'Login successful!',
            token: jwtToken,
            username: user.username, // Update based on user model
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            isActive: user.isActive,
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'An unexpected error occurred during login.' });
    }
};

// Get user by username
const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username; // Get the username from the route parameters
        const user = await userModel.findOne({ username }); // Fetch the user from the database
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isActive: user.isActive,
                dateJoined: user.dateJoined,
                lastLogin: user.lastLogin,
            },
            message: "User info fetched"
        }); // Return the user data
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { signup, login, getUserByUsername };
