import { Problem } from "../models/problems.model.js";

export const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find({})
            .select(
                "title slug description difficulty category tags starterCode examples constraints"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: problems.length,
            problems,
        });

    } catch (error) {
        console.log("Error From Get Problems: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch problems",
        });
    }
}


export const getProblem = async (req, res) => {
    try {

        const { id } = req.params

        const problem = await Problem.findById(id)
            .select(
                "title slug description difficulty category tags starterCode examples constraints testCases"
            )
            .lean();

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
                success: false
            })
        }
        const publicTestCases = problem.testCases
            .filter((testCase) => !testCase.hidden)
            .map((testCase) => ({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
            }));

        return res.status(200).json({
            success: true,
            problem: {
                _id: problem._id,
                title: problem.title,
                slug: problem.slug,
                description: problem.description,
                difficulty: problem.difficulty,
                category: problem.category,
                tags: problem.tags,
                starterCode: problem.starterCode,
                examples: problem.examples,
                constraints: problem.constraints,
                testCases: publicTestCases,
            },
        });

    } catch (error) {
        console.log("Error from get Problem: ", error)
        return res.status(500).json({
            message: "Failed to fetch the required problem",
            success: false
        })
    }
}



export const createProblem = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            difficulty,
            category,
            tags,
            starterCode,
            examples,
            constraints,
            testCases,
        } = req.body;

        if (
            !title ||
            !slug ||
            !description ||
            !difficulty ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, slug, description, difficulty and category are required",
            });
        }

        const existingProblem = await Problem.findOne({
            $or: [
                { slug },
                { title: title.trim() }
            ]
        });
        if (existingProblem) {
            if (existingProblem.slug === slug) {
                return res.status(409).json({
                    success: false,
                    message: "A problem with this slug already exists"
                });
            }

            return res.status(409).json({
                success: false,
                message: "A problem with this title already exists"
            });
        }

        const problem = await Problem.create({
            title,
            slug,
            description,
            difficulty,
            category,
            tags,
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