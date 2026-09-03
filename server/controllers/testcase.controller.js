import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";

const normalizeTestCasePayload = (payload, problem) => {
  const {
    input,
    expectedOutput,
    explanation = "",
    allowedLanguages,
    hidden = false,
  } = payload;

  if (typeof input !== "string" || !input.trim()) {
    return {
      error: "Input is required",
    };
  }

  if (
    typeof expectedOutput !== "string" ||
    !expectedOutput.trim()
  ) {
    return {
      error: "Expected output is required",
    };
  }

  if (
    !Array.isArray(allowedLanguages) ||
    allowedLanguages.length === 0
  ) {
    return {
      error: "At least one allowed language is required",
    };
  }

  const invalidLanguages = allowedLanguages.filter(
    (language) => !SUPPORTED_LANGUAGES.includes(language)
  );

  if (invalidLanguages.length > 0) {
    return {
      error: `Invalid language(s): ${invalidLanguages.join(", ")}`,
    };
  }

  const problemLanguages =
    problem.codingConfig?.languages ||
    problem.supportedLanguages ||
    SUPPORTED_LANGUAGES;

  const unsupportedLanguages = allowedLanguages.filter(
    (language) => !problemLanguages.includes(language)
  );

  if (unsupportedLanguages.length > 0) {
    return {
      error: `Language(s) not supported by this problem: ${unsupportedLanguages.join(", ")}`,
    };
  }

  return {
    data: {
      input: input.trim(),
      expectedOutput: expectedOutput.trim(),
      explanation:
        typeof explanation === "string"
          ? explanation.trim()
          : "",
      allowedLanguages,
      hidden: Boolean(hidden),
    },
  };
};


// ADD TEST CASE
export const addTestCase = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const { data, error } = normalizeTestCasePayload(
      req.body,
      problem
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const newTestCase = {
      _id: new mongoose.Types.ObjectId(),
      ...data,
    };

    if (!problem.codingConfig) {
      problem.codingConfig = {
        languages: problem.supportedLanguages || ["javascript"],
        starterCode: problem.starterCode || {},
        testCases: [],
      };
    }

    problem.codingConfig.testCases.push(newTestCase);
    problem.testCases = problem.codingConfig.testCases;

    await problem.save();

    return res.status(201).json({
      success: true,
      message: "Test case added successfully",
      testCase: newTestCase,
    });
  } catch (error) {
    console.error("Add test case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add test case",
    });
  }
};


// GET ALL TEST CASES
export const getTestCases = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const testCases =
      problem.codingConfig?.testCases ||
      problem.testCases ||
      [];

    return res.status(200).json({
      success: true,
      count: testCases.length,
      testCases,
    });
  } catch (error) {
    console.error("Get test cases error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test cases",
    });
  }
};


// GET SINGLE TEST CASE
export const getTestCase = async (req, res) => {
  try {
    const { problemId, testCaseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(testCaseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID or test case ID",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const testCases =
      problem.codingConfig?.testCases ||
      problem.testCases ||
      [];

    const testCase = testCases.find(
      (tc) => tc._id.toString() === testCaseId
    );

    if (!testCase) {
      return res.status(404).json({
        success: false,
        message: "Test case not found",
      });
    }

    return res.status(200).json({
      success: true,
      testCase,
    });
  } catch (error) {
    console.error("Get test case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test case",
    });
  }
};


// UPDATE TEST CASE
export const updateTestCase = async (req, res) => {
  try {
    const { problemId, testCaseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(testCaseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID or test case ID",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!problem.codingConfig) {
      problem.codingConfig = {
        languages: problem.supportedLanguages || ["javascript"],
        starterCode: problem.starterCode || {},
        testCases: problem.testCases || [],
      };
    }

    const testCases = problem.codingConfig.testCases || [];
    const index = testCases.findIndex(
      (tc) => tc._id.toString() === testCaseId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Test case not found",
      });
    }

    const { data, error } = normalizeTestCasePayload(
      req.body,
      problem
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const updatedTestCase = {
      _id: testCases[index]._id,
      ...data,
    };

    problem.codingConfig.testCases[index] = updatedTestCase;
    problem.testCases = problem.codingConfig.testCases;

    await problem.save();

    return res.status(200).json({
      success: true,
      message: "Test case updated successfully",
      testCase: updatedTestCase,
    });
  } catch (error) {
    console.error("Update test case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update test case",
    });
  }
};


// DELETE TEST CASE
export const deleteTestCase = async (req, res) => {
  try {
    const { problemId, testCaseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(testCaseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID or test case ID",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!problem.codingConfig) {
      problem.codingConfig = {
        languages: problem.supportedLanguages || ["javascript"],
        starterCode: problem.starterCode || {},
        testCases: problem.testCases || [],
      };
    }

    const initialLength = (problem.codingConfig.testCases || []).length;
    problem.codingConfig.testCases = (problem.codingConfig.testCases || []).filter(
      (tc) => tc._id.toString() !== testCaseId
    );

    if (problem.codingConfig.testCases.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Test case not found",
      });
    }

    problem.testCases = problem.codingConfig.testCases;
    await problem.save();

    return res.status(200).json({
      success: true,
      message: "Test case deleted successfully",
    });
  } catch (error) {
    console.error("Delete test case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete test case",
    });
  }
};
