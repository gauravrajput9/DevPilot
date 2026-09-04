import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import problemRoutes from "../routes/problem.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import submissionRoutes from "../routes/submission.routes.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { auth } from "./lib/auth.js";
import connectDB from "../utils/connectDB.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Application Routes
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/problems", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    message: "Authenticated",
    user: req.user,
    session: req.session,
  });
});

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});