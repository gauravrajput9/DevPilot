import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import problemRoutes from "../routes/problem.routes.js"
import adminRoutes from "../routes/admin.routes.js"
import { requireAuth } from "../middleware/auth.middleware.js";

import { auth } from "./lib/auth.js";
import connectDB from "../utils/connectDB.js";
import submissionRouter from "../routes/submission.routes.js";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())

app.use("/api/submissions", (req, res, next) => {
  console.log("Submission request:", req.method, req.originalUrl);
  next();
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRouter)
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