import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
    generateToken
} from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const userExists = await User.findOne({
            email
        });
        if (userExists)
            return res.status(400).json({
                message: "Email already registered"
            });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        };

        return res.json({
            message: "Registered successfully",
            token: generateToken(user._id),
            user: userResponse,
        });
    } catch (e) {
        console.error("Register error:", e);
        res.status(500).json({
            message: "Server error during registration",
            error: e.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        const user = await User.findOne({
            email
        });
        if (!user) return res.status(400).json({
            message: "Invalid email or password"
        });

        if (!user.password) {
            return res.status(400).json({
                message: "Please login with Google"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({
            message: "Invalid email or password"
        });

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        };

        return res.json({
            message: "Logged in successfully",
            token: generateToken(user._id),
            user: userResponse,
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({
            message: "Server error during login",
            error: e.message
        });
    }
};

// ---------- Google Login (from Passport) ----------
export const googleSuccess = (req, res) => {
    const user = req.user;
    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(
        `http://localhost:5173/auth/google/success?token=${token}`
    );
};