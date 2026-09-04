import express from "express";

import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.middleware.js";

import {
  getAdminProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";

import {
  addTestCase,
  deleteTestCase,
  getTestCase,
  getTestCases,
  updateTestCase,
} from "../controllers/testcase.controller.js";

import {
  getAdminUsers,
  updateUserRole,
  toggleUserBan,
  getAdminSubmissions,
  getAdminSubmissionById,
  getAdminAnalytics,
  getAdminSettings,
  testPistonHealth,
} from "../controllers/admin.controller.js";

const router = express.Router();

//------------------------------------------------------------------------------
// Admin Users Management
//------------------------------------------------------------------------------
router.get("/users", requireAuth, requireAdmin, getAdminUsers);
router.patch("/users/:userId/role", requireAuth, requireAdmin, updateUserRole);
router.patch("/users/:userId/ban", requireAuth, requireAdmin, toggleUserBan);

//------------------------------------------------------------------------------
// Admin Submissions Management
//------------------------------------------------------------------------------
router.get("/submissions", requireAuth, requireAdmin, getAdminSubmissions);
router.get("/submissions/:id", requireAuth, requireAdmin, getAdminSubmissionById);

//------------------------------------------------------------------------------
// Admin Analytics
//------------------------------------------------------------------------------
router.get("/analytics", requireAuth, requireAdmin, getAdminAnalytics);

//------------------------------------------------------------------------------
// Admin Settings & Diagnostics
//------------------------------------------------------------------------------
router.get("/settings", requireAuth, requireAdmin, getAdminSettings);
router.post("/settings/piston-test", requireAuth, requireAdmin, testPistonHealth);

//------------------------------------------------------------------------------
// Admin Problem Routes (direct and sub-path)
//------------------------------------------------------------------------------
router.get("/problems", requireAuth, requireAdmin, getAdminProblems);
router.post("/problems", requireAuth, requireAdmin, createProblem);
router.put("/problems/update", requireAuth, requireAdmin, updateProblem);
router.delete("/problems/:problemId", requireAuth, requireAdmin, deleteProblem);

router.get("/", requireAuth, requireAdmin, getAdminProblems);
router.post("/", requireAuth, requireAdmin, createProblem);

//------------------------------------------------------------------------------
// Admin Test Case Routes
//------------------------------------------------------------------------------
router.post("/:problemId/testcases", requireAuth, requireAdmin, addTestCase);
router.get("/:problemId/testcases", requireAuth, requireAdmin, getTestCases);
router.get("/:problemId/testcases/:testCaseId", requireAuth, requireAdmin, getTestCase);
router.patch("/:problemId/testcases/:testCaseId", requireAuth, requireAdmin, updateTestCase);
router.delete("/:problemId/testcases/:testCaseId", requireAuth, requireAdmin, deleteTestCase);
router.post("/:problemId/testcases/create", requireAuth, requireAdmin, addTestCase);

// Legacy Problem Management routes
router.put("/update", requireAuth, requireAdmin, updateProblem);
router.delete("/:problemId", requireAuth, requireAdmin, deleteProblem);

export default router;
