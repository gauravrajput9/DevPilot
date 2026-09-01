import mongoose from "mongoose";
import { Problem } from "../models/problems.model.js";

const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp"];

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

    const unsupportedLanguages = allowedLanguages.filter(
        (language) => !problem.supportedLanguages.includes(language)
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

        // Validate problem ID
        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        // Find problem
        const problem = await Problem.findById(problemId)
            .select("supportedLanguages");

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

        // Add test case
        const newTestCase = {
            _id: new mongoose.Types.ObjectId(),
            ...data,
        };

        await Problem.updateOne(
            { _id: problemId },
            {
                $push: {
                    testCases: newTestCase,
                },
            },
            {
                runValidators: true,
            }
        );

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

        const problem = await Problem.findById(problemId)
            .select("testCases");

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

        if (
            !mongoose.Types.ObjectId.isValid(problemId) ||
            !mongoose.Types.ObjectId.isValid(testCaseId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID or test case ID",
            });
        }

        const problem = await Problem.findById(problemId)
            .select("supportedLanguages testCases._id");

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

        await Problem.updateOne(
            {
                _id: problemId,
                "testCases._id": testCaseId,
            },
            {
                $set: {
                    "testCases.$.input": data.input,
                    "testCases.$.expectedOutput": data.expectedOutput,
                    "testCases.$.explanation": data.explanation,
                    "testCases.$.allowedLanguages": data.allowedLanguages,
                    "testCases.$.hidden": data.hidden,
                },
            },
            {
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Test case updated successfully",
            testCase: {
                _id: testCaseId,
                ...data,
            },
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

        const problem = await Problem.findById(problemId)
            .select("testCases._id");

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

        await Problem.updateOne(
            { _id: problemId },
            {
                $pull: {
                    testCases: {
                        _id: testCaseId,
                    },
                },
            }
        );

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
