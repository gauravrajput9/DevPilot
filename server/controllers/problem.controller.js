import { Problem } from "../models/problems.model.js";
import { LANGUAGES } from "../constants/languages.js";
// Get all problems
export const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find()
            .select(
                "title slug difficulty category tags createdAt"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            problems,
        });
    } catch (error) {
        console.error("Get problems error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch problems",
        });
    }
};

// Get single problem
export const getProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findById(id).select(
            "-testCases"
        );

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            problem,
        });
    } catch (error) {
        console.error("Get problem error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch problem",
        });
    }
};



export const createProblem = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            difficulty,
            category,
            tags,
            allowedLanguages,
            starterCode,
            examples,
            constraints,
            testCases,
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !slug ||
            !description ||
            !difficulty ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // Validate allowedLanguages
        if (
            !Array.isArray(allowedLanguages) ||
            allowedLanguages.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Select at least one programming language",
            });
        }

        // Check whether all languages are supported
        const invalidLanguages = allowedLanguages.filter(
            (language) => !LANGUAGES[language]
        );

        if (invalidLanguages.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid programming language",
                invalidLanguages,
            });
        }

        // Check duplicate slug
        const existingProblem = await Problem.findOne({ slug });

        if (existingProblem) {
            return res.status(409).json({
                success: false,
                message: "A problem with this slug already exists",
            });
        }

        // Create problem
        const problem = await Problem.create({
            title,
            slug,
            description,
            difficulty,
            category,
            tags,
            allowedLanguages,
            starterCode,
            examples,
            constraints,
            testCases,
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem,
        });
    } catch (error) {
        console.error("Create problem error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create problem",
        });
    }
};

// Update problem
export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            problem,
        });
    } catch (error) {
        console.error("Update problem error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update problem",
        });
    }
};

// Delete problem
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findByIdAndDelete(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.error("Delete problem error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete problem",
        });
    }
};