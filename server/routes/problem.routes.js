import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { getProblems, getProblem, createProblem } from "../controllers/problem.controller.js";



const router = express.Router();

router.get("/", requireAuth, getProblems);

router.get("/:id", requireAuth, getProblem);

router.post("/",requireAuth, requireAdmin, createProblem);

// router.put("/:id",requireAuth, requireAdmin, updateProblem);

// router.delete("/:id", requireAuth, requireAdmin, deleteProblem);

export default router;