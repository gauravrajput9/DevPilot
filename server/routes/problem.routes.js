import express from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
    getProblems,
    getProblem,
} from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", requireAuth, getProblems);

router.get("/:id", requireAuth, getProblem);

export default router;