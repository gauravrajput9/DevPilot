import mongoose from "mongoose";

import { Problem } from "../models/problem.model.js";
import { CodingSubmission } from "../models/codingSubmission.model.js";
import { UserProblem } from "../models/userProblem.model.js";
import { executeCode } from "../services/piston.service.js";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";


/* =========================================================
   HELPERS
========================================================= */

/**
 * Normalize program output before comparison.
 * Handles Windows (\r\n) and Unix (\n) newlines and trailing spaces.
 */
const normalizeOutput = (output = "") => {
  return String(output)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
};

/**
 * Check whether a language is supported.
 */
const isSupportedLanguage = (language) => {
  return SUPPORTED_LANGUAGES.includes(language);
};

/**
 * Determine the execution status from Piston output.
 */
const getExecutionStatus = (result) => {
  const compile = result?.compile;
  const run = result?.run;

  if (!run) {
    return "runtime_error";
  }

  if (compile && (compile.code !== 0 || compile.signal)) {
    return "compile_error";
  }

  if (run.code !== 0 || run.signal) {
    return "runtime_error";
  }

  return "accepted";
};


/* =========================================================
   RUN CODE
========================================================= */

/**
 * POST /api/submissions/run
 * or POST /api/submissions/coding/run
 *
 * Runs code against custom stdin without recording a submission.
 */
export const runCodingCode = async (req, res) => {
  try {
    const {
      language,
      sourceCode,
      stdin = "",
    } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required",
      });
    }

    if (sourceCode === undefined || sourceCode === null) {
      return res.status(400).json({
        success: false,
        message: "Source code is required",
      });
    }

    if (!isSupportedLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language: ${language}`,
      });
    }

    const result = await executeCode({
      language,
      sourceCode,
      stdin,
    });

    const compile = result?.compile;
    const run = result?.run;
    const status = getExecutionStatus(result);

    return res.status(200).json({
      success: true,
      status,
      output: run?.output ?? run?.stdout ?? "",
      stdout: run?.stdout ?? "",
      stderr: compile?.stderr || run?.stderr || "",
      code: run?.code ?? null,
      signal: run?.signal ?? null,
      memory: run?.memory ?? null,
      cpuTime: run?.cpu_time ?? null,
      wallTime: run?.wall_time ?? null,
    });

  } catch (error) {
    console.error(
      "Run coding code error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Code execution failed",
    });
  }
};


/* =========================================================
   SUBMIT CODE
========================================================= */

/**
 * POST /api/submissions/submit
 * or POST /api/submissions/coding/submit
 *
 * Runs submitted code against problem test cases and records a submission.
 */
export const submitCodingCode = async (req, res) => {
  try {
    const {
      problemId,
      language,
      sourceCode,
    } = req.body;

    /* 1. Validate request */
    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required",
      });
    }

    if (sourceCode === undefined || sourceCode === null) {
      return res.status(400).json({
        success: false,
        message: "Source code is required",
      });
    }

    /* 2. Validate language */
    if (!isSupportedLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language: ${language}`,
      });
    }

    /* 3. Find problem */
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    /* 4. Verify practice type */
    if (problem.practiceType !== "coding") {
      return res.status(400).json({
        success: false,
        message: "This is not a coding problem",
      });
    }

    /* 5. Check supported languages for this problem */
    const supportedLanguages =
      problem.codingConfig?.languages ||
      problem.supportedLanguages ||
      SUPPORTED_LANGUAGES;

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `This problem does not support ${language}`,
      });
    }

    /* 6. Get test cases */
    const allTestCases =
      problem.codingConfig?.testCases ||
      problem.testCases ||
      [];

    const testCases = allTestCases.filter((testCase) =>
      !testCase.allowedLanguages ||
      testCase.allowedLanguages.length === 0 ||
      testCase.allowedLanguages.includes(language)
    );

    if (testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No test cases are available for ${language}`,
      });
    }

    /* 7. Verify authenticated user */
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please sign in to submit",
      });
    }

    /* 8. Create pending submission */
    const submission = await CodingSubmission.create({
      userId: req.user.id,
      problemId,
      language,
      sourceCode,
      status: "pending",
      passedTests: 0,
      totalTests: testCases.length,
    });

    /* 9. Judge test cases */
    let passedTests = 0;
    let finalStatus = "accepted";
    let executionTime = null;
    let memory = null;
    let failedTestInfo = null;
    let submissionError = "";

    for (let index = 0; index < testCases.length; index++) {
      const testCase = testCases[index];
      const testNumber = index + 1;
      let result;

      try {
        result = await executeCode({
          language,
          sourceCode,
          stdin: testCase.input,
        });
      } catch (error) {
        console.error(
          `Piston error on test ${testNumber}:`,
          error.response?.data || error.message
        );
        finalStatus = "runtime_error";
        submissionError = error.response?.data?.message || error.message || "Runtime error";
        failedTestInfo = {
          testNumber,
          testCaseId: testCase._id ? String(testCase._id) : undefined,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "",
          stdout: "",
          error: submissionError,
          hidden: Boolean(testCase.hidden),
        };
        break;
      }

      const compile = result?.compile;
      const run = result?.run;

      if (compile && (compile.code !== 0 || compile.signal)) {
        finalStatus = "compile_error";
        submissionError = compile.stderr || run?.stderr || "Compilation failed";
        failedTestInfo = {
          testNumber,
          testCaseId: testCase._id ? String(testCase._id) : undefined,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "",
          stdout: "",
          error: submissionError,
          hidden: Boolean(testCase.hidden),
        };
        break;
      }

      if (!run) {
        finalStatus = "runtime_error";
        submissionError = "No execution output received";
        failedTestInfo = {
          testNumber,
          testCaseId: testCase._id ? String(testCase._id) : undefined,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "",
          stdout: "",
          error: submissionError,
          hidden: Boolean(testCase.hidden),
        };
        break;
      }

      if (run.code !== 0 || run.signal) {
        finalStatus = "runtime_error";
        executionTime = run.wall_time ?? null;
        memory = run.memory ?? null;
        submissionError = run.stderr || compile?.stderr || "Runtime error";
        failedTestInfo = {
          testNumber,
          testCaseId: testCase._id ? String(testCase._id) : undefined,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: normalizeOutput(run.stdout ?? run.output ?? ""),
          stdout: run.stdout ?? "",
          error: submissionError,
          hidden: Boolean(testCase.hidden),
        };
        break;
      }

      executionTime = Math.max(executionTime || 0, run.wall_time ?? 0);
      memory = Math.max(memory || 0, run.memory ?? 0);

      const actualOutput = normalizeOutput(run.stdout ?? run.output ?? "");
      const expectedOutput = normalizeOutput(testCase.expectedOutput);

      if (actualOutput !== expectedOutput) {
        finalStatus = "wrong_answer";
        failedTestInfo = {
          testNumber,
          testCaseId: testCase._id ? String(testCase._id) : undefined,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          stdout: run.stdout ?? "",
          error: "",
          hidden: Boolean(testCase.hidden),
        };
        break;
      }

      passedTests++;
    }

    /* 10. Update submission in database */
    submission.status = finalStatus;
    submission.passedTests = passedTests;
    submission.totalTests = testCases.length;
    submission.executionTime = executionTime;
    submission.memory = memory;
    submission.error = submissionError;
    submission.failedTest = failedTestInfo;
    await submission.save();

    /* 11. Update user problem stats */
    try {
      const isAccepted = finalStatus === "accepted";
      const userProblem = await UserProblem.findOne({
        userId: req.user.id,
        problemId,
      });

      if (!userProblem) {
        await UserProblem.create({
          userId: req.user.id,
          problemId,
          attempts: 1,
          status: isAccepted ? "solved" : "attempted",
          solvedAt: isAccepted ? new Date() : null,
          lastAttemptedAt: new Date(),
        });
      } else {
        userProblem.attempts = (userProblem.attempts || 0) + 1;
        userProblem.lastAttemptedAt = new Date();

        if (isAccepted) {
          userProblem.status = "solved";
          if (!userProblem.solvedAt) {
            userProblem.solvedAt = new Date();
          }
        }

        await userProblem.save();
      }
    } catch (userProblemError) {
      console.error("Failed to update UserProblem stats:", userProblemError.message);
    }

    /* 12. Format response */
    const response = {
      success: true,
      submissionId: submission._id,
      status: finalStatus,
      passedTests,
      totalTests: testCases.length,
      executionTime,
      memory,
      error: submissionError,
      message:
        finalStatus === "accepted"
          ? "Accepted"
          : finalStatus === "wrong_answer"
          ? "Wrong Answer"
          : finalStatus === "compile_error"
          ? "Compilation Error"
          : finalStatus === "runtime_error"
          ? "Runtime Error"
          : "Submission failed",
    };

    if (failedTestInfo !== null) {
      response.failedTest = failedTestInfo;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error(
      "Submit coding code error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Submission failed",
    });
  }
};


/* =========================================================
   SUBMISSION QUERY CONTROLLERS
========================================================= */

/**
 * GET /api/submissions/coding/:id
 * Fetch a single submission by its ID.
 */
export const getCodingSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
    }

    const submission = await CodingSubmission.findById(id).populate(
      "problemId",
      "title slug difficulty category"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Get submission by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submission",
    });
  }
};

/**
 * GET /api/submissions/coding/problem/:problemId
 * Fetch submissions made by the authenticated user for a specific problem.
 */
export const getCodingSubmissionsForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    const submissions = await CodingSubmission.find({
      userId: req.user.id,
      problemId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get submissions for problem error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};

/**
 * GET /api/submissions/user
 * Fetch authenticated user's recent submissions.
 */
export const getUserCodingSubmissions = async (req, res) => {
  try {
    const submissions = await CodingSubmission.find({
      userId: req.user.id,
    })
      .populate("problemId", "title slug difficulty category")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get user submissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user submissions",
    });
  }
};