import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../src/lib/auth.js"; 

export const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Authentication failed",
        });
    }
};



export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
        });
    }

    next();
};