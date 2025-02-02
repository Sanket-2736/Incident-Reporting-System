const registeredUsersModel = require('../models/registeredUsers.model');

const User = require('../models/user.model.js'); 
const bcrypt = require('bcryptjs')

exports.verify = async (req, res) => {
    try {
        const id = req.params.id;
        const { approval } = req.body;

        console.log("Id: ", id, " Approval: ", approval)

        if (!id || approval == null) {  // Handles both null and undefined
            return res.status(400).json({
                success: false,
                message: "User ID and approval status are required",
            });
        }

        const user = await registeredUsersModel.findById(id);

        console.log(user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (approval === true) {
            // Approve user
            const name = `${user.firstName} ${user.lastName}`;
            const newUser = new User({
                name: name,
                email: user.email,
                address: user.address,
                aadharCard: user.aadharCard,
                profilePic: user.photo,
                mobile: user.mobile,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
            });

            await newUser.save();
            await registeredUsersModel.findByIdAndDelete(id);  // Ensure user is deleted after newUser is saved

            return res.status(200).json({
                success: true,
                message: "User approved successfully and moved to the main database",
            });
        } else {
            // Reject user
            user.status = 'rejected';
            await user.save();

            return res.status(200).json({
                success: true,
                message: "User rejected successfully",
            });
        }
    } catch (error) {
        console.error("Error in user verification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.viewRegistrations = async (req, res) => {
    try {
        // Fetch all registered users
        const registeredUsers = await registeredUsersModel.find();

        if (!registeredUsers.length) {
            return res.status(404).json({
                success: false,
                message: "No registered users found",
            });
        }

        // Format the response to include necessary fields
        const formattedUsers = registeredUsers.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            status: user.status, // Include the approval status
            aadharCard: user.aadharCard,
            photo: user.photo,
            createdAt: user.createdAt,
        }));

        return res.status(200).json({
            success: true,
            users: formattedUsers,
        });
    } catch (error) {
        console.error("Error in viewing registrations: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.removeUser = async (req, res) => {
    try {
        const userId = req.params.ID; 

        const response = await User.findByIdAndDelete(userId); 

        if (response) {
            res.json({
                success: true,
                message: "User deleted successfully",
            });
        } else {
            res.json({
                success: false,
                message: "User not found", // Handle case when user is not found
            });
        }
    } catch (error) {
        console.error("Error in deleting user: ", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error", // Return appropriate error response
        });
    }
};