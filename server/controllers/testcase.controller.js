import mongoose from "mongoose";
import { Problem } from "../models/problems.model.js";

const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp"];

// ADD TEST CASE

export const addTestCase = async (req, res) => {
    try {
        const { problemId } = req.params;

        const {
            input,
            expectedOutput,
            allowedLanguages,
            hidden = false,
        } = req.body;

        // Validate problem ID
        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        // Validate input/output
        if (
            typeof input !== "string" ||
            typeof expectedOutput !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Input and expectedOutput must be strings",
            });
        }

        // Validate languages
        if (
            !Array.isArray(allowedLanguages) ||
            allowedLanguages.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one allowed language is required",
            });
        }

        const invalidLanguages = allowedLanguages.filter(
            (language) =>
                !SUPPORTED_LANGUAGES.includes(language)
        );

        if (invalidLanguages.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid language(s): ${invalidLanguages.join(", ")}`,
            });
        }

        // Find problem
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        // Make sure languages are supported by the problem
        const unsupportedLanguages =
            allowedLanguages.filter(
                (language) =>
                    !problem.supportedLanguages.includes(language)
            );

        if (unsupportedLanguages.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Language(s) not supported by this problem: ${unsupportedLanguages.join(", ")}`,
            });
        }

        // Add test case
        problem.testCases.push({
            input,
            expectedOutput,
            allowedLanguages,
            hidden: Boolean(hidden),
        });

        await problem.save();

        const newTestCase =
            problem.testCases[problem.testCases.length - 1];

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

        const problem = await Problem.findById(problemId)
            .select("testCases");

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            count: problem.testCases.length,
            testCases: problem.testCases,
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

        const testCase = problem.testCases.id(testCaseId);

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

        const {
            input,
            expectedOutput,
            allowedLanguages,
            hidden,
        } = req.body;

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

        const testCase = problem.testCases.id(testCaseId);

        if (!testCase) {
            return res.status(404).json({
                success: false,
                message: "Test case not found",
            });
        }

        // Update input
        if (input !== undefined) {
            if (typeof input !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Input must be a string",
                });
            }

            testCase.input = input;
        }

        // Update expected output
        if (expectedOutput !== undefined) {
            if (typeof expectedOutput !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "expectedOutput must be a string",
                });
            }

            testCase.expectedOutput = expectedOutput;
        }

        // Update languages
        if (allowedLanguages !== undefined) {
            if (
                !Array.isArray(allowedLanguages) ||
                allowedLanguages.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "At least one allowed language is required",
                });
            }

            const invalidLanguages =
                allowedLanguages.filter(
                    (language) =>
                        !SUPPORTED_LANGUAGES.includes(language)
                );

            if (invalidLanguages.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid language(s): ${invalidLanguages.join(", ")}`,
                });
            }

            const unsupportedLanguages =
                allowedLanguages.filter(
                    (language) =>
                        !problem.supportedLanguages.includes(
                            language
                        )
                );

            if (unsupportedLanguages.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Language(s) not supported by this problem: ${unsupportedLanguages.join(", ")}`,
                });
            }

            testCase.allowedLanguages = allowedLanguages;
        }

        // Update hidden status
        if (hidden !== undefined) {
            testCase.hidden = Boolean(hidden);
        }

        await problem.save();

        return res.status(200).json({
            success: true,
            message: "Test case updated successfully",
            testCase,
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

        const testCase = problem.testCases.id(testCaseId);

        if (!testCase) {
            return res.status(404).json({
                success: false,
                message: "Test case not found",
            });
        }

        testCase.deleteOne();

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