import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({
            message: "Unauthorized"
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

// Admin middleware - check if user is admin
export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};