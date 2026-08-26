import express from "express"
import { runCode } from "../controllers/submission.controller.js"

const submissionRouter = express.Router()

submissionRouter.post("/run", runCode)


export default submissionRouter