const RegisteredUser = require('../models/registeredUsers.model.js'); 
const reportModel = require('../models/report.model.js')
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary.js');
const {generateToken} = require('../config/utils.js');
const User = require('../models/user.model.js');
const Incident = require('../models/incident.model.js');
const ReportModel = require('../models/report.model.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const incidentModel = require("../models/incident.model.js");
const userModel = require('../models/user.model.js');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || 'AIzaSyCt5aHQnQRI5TWCPwn5M1OcmjUb9Udkb1k');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.predictSeverity = async (description) => {
    try {
        const prompt = `Given the incident description: "${description}", predict its severity in one word (low, medium, high, critical).`;
        const result = await model.generateContent(prompt);
        return result.response.text().toLowerCase().trim();
    } catch (error) {
        console.error("Error generating content:", error);
    }
};


exports.adminSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, address, password } = req.body;

        // Validate input fields
        if (!firstName || !lastName || !email || !mobile || !address || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin with this email already exists",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            mobile,
            address,
            password: hashedPassword,
            role: 'admin', // Explicitly set the role as 'admin'
        });

        // Save the admin user to the database
        await newAdmin.save();

        // Generate JWT token
        const token = generateToken(newAdmin._id, res);

        // Send response
        res.status(201).json({
            message: "Admin registered successfully",
            success: true,
            token,
            admin: {
                id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error("Error in adminSignUp: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.authoritySignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, address, password, aadharCard } = req.body;

        // Validate input fields
        if (!firstName || !lastName || !email || !mobile || !address || !password || !aadharCard) {
            return res.status(400).json({
                message: "All fields are required, including Aadhar Card.",
                success: false,
            });
        }

        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email, role: 'authority' });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin with this email already exists.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            mobile,
            address,
            password: hashedPassword,
            aadharCard,
            role: 'authority',
        });

        // Save the admin user to the database
        await newAdmin.save();

        // Generate JWT token
        const token = generateToken(newAdmin._id, res);

        // Send response
        res.status(201).json({
            message: "Admin registered successfully.",
            success: true,
            token,
            admin: {
                id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error("Error in adminSignUp: ", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};


exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, aadharCard, address, password, photo } = req.body;
        console.log(req.body);
        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !mobile || !aadharCard || !address || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Check if the user already exists
        const existingUser = await RegisteredUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        

        // Upload Aadhar card to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(aadharCard);
        if (!uploadResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload Aadhar card to Cloudinary", success: false });
        }
        const uploadPhoto = await cloudinary.uploader.upload(photo);
        if (!uploadPhoto.secure_url) {
            return res.status(500).json({ message: "Failed to upload photo to Cloudinary", success: false });
        }

        // Create a new registered user
        const newUser = new RegisteredUser({
            firstName,
            lastName,
            email,
            mobile,
            aadharCard: uploadResponse.secure_url,
            photo: uploadPhoto.secure_url,
            address,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id, res);

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            token,
            userId: newUser._id,
            user: {
              id: newUser._id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
            }
          });
          
    } catch (error) {
        console.error("Error in signup: ", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                success: false,
            });
        }

        

        // Check password validity
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        // Generate JWT token
        const token = generateToken(user._id, res);

        // Send response
        res.json({
            message: "Login successful!",
            success: true,
            token,
            userId: user._id,
            user: user,
        });
    } catch (error) {
        console.error('Error in login: ', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, httpOnly: true });        
        res.status(200).json({
            message: "Logout successful!",
            success: true,
        });
    } catch (error) {
        console.error("Error in logout: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.checkApproval = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        // Find the user by email
        const user = await RegisteredUser.findOne({ email });

        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Create response message and status
        const msg = `Your status is: ${user.status}`;
        const isApproved = user.status === "approved";

        // Send response
        return res.status(200).json({
            message: msg,
            success: isApproved,
        });
    } catch (error) {
        console.error("Error in fetching status: ", error);

        // Handle server error
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "ProfilePic is required!" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully!",
            updatedUser,
        });
    } catch (error) {
        console.error("Error in updating profile:", error);
        res.status(500).json({
            message: "Error in updating profile!",
            error: error.message,
        });
    }
};

exports.reportIncident = async (req, res) => {
    const { title, description, location, image } = req.body;
    try {
        // Validate required fields
        if (!title || !description || !location || !image) {
            return res.status(400).json({
                message: "Please fill all the fields.",
                success: false,
            });
        }


        const uploadResponse = await cloudinary.uploader.upload(image);
        if (!uploadResponse.secure_url) {
            return res.status(500).json({
                message: "Failed to upload image. Try again.",
                success: false,
            });
        }

        // Await severity prediction
        const severity = await this.predictSeverity(description);

        // Create new incident
        const incident = new Incident({
            title,
            description,
            location,
            severity,
            reportedBy: req.user._id, // Assuming req.user is set correctly
            image : uploadResponse.secure_url
        });

        await incident.save();

        res.status(201).json({
            message: "Incident reported successfully!",
            incident,
        });
    } catch (error) {
        console.error("Error in reporting incident: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

exports.getReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = reportModel.findById(reportId);

        if(!report){
            return res.json({
                message: "Report not found",
                success: false
            })
        }

        return res.json({
            report: report,
            success: true,
            message : "Success in fetching report!"
        })
    } catch (error) {
        console.log("Error in fetching report: ", error);
        return res.json({
            message: "Internal Server Error",
            success: false
        })        
    }
}

exports.getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Fetch user from DB
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.json({
            notifications: user.notifications,
            success: true,
            message: "Success in fetching notifications!"
        });
    } catch (error) {
        console.log("Error in fetching notifications: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });        
    }
};

exports.viewIncident = async (req, res) => {
    const incidentId = req.params.id;

    try {
        const incident = await incidentModel.findById(incidentId);

        console.log(incident);        

        if(!incident){
            return res.json({
                success: false, 
                message : "Incident doesn't exists!",
            })
        }

        return res.json({
            success : true,
            message : "Incident fetched successfully!",
            incident : incident,
        })
    } catch (error) {
        console.log("Error in viewing incident: ", error);
        return res.json({
            success : false,
            message : "Internal Server Error",
        })
    }
}

exports.viewReport = async (req, res) => {
    const incidentId = req.params.id;
    try {
        const incident = await incidentModel.findById(incidentId);

        if(!incident){
            return res.json({
                success : false, 
                message : "Incident not found!"
            });
        }

        const reportId = incident.report;

        const report = await reportModel.findById(reportId);

        console.log(report);

        if(!report){
            return res.json({
                success : false, 
                message : "Report not found!",
            });
        }

        return res.json({
            success : true,
            message : "Report fetched successfully!",
            report : report
        })

    } catch (error) {
        console.log("Error in fetching report: ", error);
        return res.json({
            success : false, 
            message : "Internal server error"
        })
    }
}
