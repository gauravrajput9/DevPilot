import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  runCodingCode,
  submitCodingCode,
  getCodingSubmissionById,
  getCodingSubmissionsForProblem,
  getUserCodingSubmissions,
} from "../controllers/codingSubmission.controller.js";
import {
  runFrontendCode,
  submitFrontendCode,
} from "../controllers/frontendSubmission.controller.js";
import {
  runBackendCode,
  submitBackendCode,
} from "../controllers/backendSubmission.controller.js";

const router = express.Router();

/* =========================================================
   CODING SUBMISSION ROUTES
========================================================= */

// Execution with custom stdin (no submission recorded)
router.post("/run", runCodingCode);
router.post("/coding/run", runCodingCode);

// Code submission (judged against problem test cases)
router.post("/submit", requireAuth, submitCodingCode);
router.post("/coding/submit", requireAuth, submitCodingCode);

// Submission queries
router.get("/user", requireAuth, getUserCodingSubmissions);
router.get("/coding/problem/:problemId", requireAuth, getCodingSubmissionsForProblem);
router.get("/coding/:id", requireAuth, getCodingSubmissionById);

/* =========================================================
   FUTURE PRACTICE TYPES (FRONTEND / BACKEND)
========================================================= */

router.post("/frontend/run", runFrontendCode);
router.post("/frontend/submit", requireAuth, submitFrontendCode);

router.post("/backend/run", runBackendCode);
router.post("/backend/submit", requireAuth, submitBackendCode);

export default router;