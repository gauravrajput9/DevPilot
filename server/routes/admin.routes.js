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
    getProblemTestCases,
    createProblemTestCase,
} from "../controllers/problem.controller.js";

import {
    addTestCase,
    deleteTestCase,
    getTestCase,
    getTestCases,
    updateTestCase,
} from "../controllers/testcase.controller.js";

const router = express.Router();

//------------------------------------------------------------------------------
// Admin Problem Routes
//------------------------------------------------------------------------------

router.get(
    "/",
    requireAuth,
    requireAdmin,
    getAdminProblems
);

router.post(
    "/",
    requireAuth,
    requireAdmin,
    createProblem
);

//------------------------------------------------------------------------------
// Admin Test Case Routes
//------------------------------------------------------------------------------

router.post(
    "/:problemId/testcases",
    requireAuth,
    requireAdmin,
    addTestCase
);

router.get(
    "/:problemId/testcases",
    requireAuth,
    requireAdmin,
    getTestCases
);

router.get(
    "/:problemId/testcases/:testCaseId",
    requireAuth,
    requireAdmin,
    getTestCase
);

router.patch(
    "/:problemId/testcases/:testCaseId",
    requireAuth,
    requireAdmin,
    updateTestCase
);

router.delete(
    "/:problemId/testcases/:testCaseId",
    requireAuth,
    requireAdmin,
    deleteTestCase
);

router.get(
  "/problems/:problemId/testcases",
  requireAuth,
  requireAdmin,
  getProblemTestCases
);

router.post(
  "/:problemId/testcases/create",
  createProblemTestCase
);

//------------------------------------------------------------------------------
// Future Problem Management
//------------------------------------------------------------------------------

router.put("/update", requireAuth, requireAdmin, updateProblem);
router.delete("/:problemId", requireAuth, requireAdmin, deleteProblem);

export default router;