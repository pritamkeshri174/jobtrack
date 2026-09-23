
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const sendWelcomeEmail = require("./emailservice");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("REGISTER EMAIL:", email);

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Account created successfully",
            userId: user._id
        });

        sendWelcomeEmail(user.name, user.email)
            .then(() => {
                console.log("Welcome email sent ✅");
            })
            .catch((error) => {
                console.error(
                    "Welcome email failed ❌",
                    error.message
                );
            });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send response
        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// GET TOTAL USERS
router.get("/count", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        res.json({
            totalUsers: totalUsers
        });

    } catch (error) {
        console.error("User Count Error:", error);

        res.status(500).json({
            message: "Failed to get user count"
        });
    }
});


// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        res.json({
            message: "Email verified. You can reset your password."
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;

        await user.save();

        res.json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;

