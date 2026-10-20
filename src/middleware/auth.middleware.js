const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


// ===============================
// Normal Authentication Middleware
// ===============================

async function authmiddleware(req, res, next) {

    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    // Token missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        // User not found
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }

        // Store user in request
        req.user = user;

        // Continue
        next();

    } catch (err) {

        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}


// ==================================
// System User Authentication Middleware
// ==================================

async function authSystemUsermiddleware(req, res, next) {

    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    // Token missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await userModel
            .findById(decoded.userId)
            .select("+systemUser");

        // User not found
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }

        // Check system user
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            });
        }

        // Store user
        req.user = user;

        // Continue
        next();

    } catch (err) {

        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}


module.exports = {
    authmiddleware,
    authSystemUsermiddleware
};