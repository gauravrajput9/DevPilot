import { Problem } from "../models/problems.model.js";

export const getProblems = async (req, res) => {
  try {
    const {
      practiceType,
      category,
      difficulty,
      problemType,
      language,
    } = req.query;

    const filters = {};

    if (practiceType) filters.practiceType = practiceType;
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (problemType) filters.problemType = problemType;
    if (language) filters.supportedLanguages = language;

    const problems = await Problem.find(filters)
      .select(
        "title slug description practiceType problemType difficulty category tags supportedLanguages starterCode examples constraints"
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







//------------------------------------
//?? Admin Problem Controllers
//------------------------------------

export const createProblem = async (req, res) => {

  console.log("USer: ", req.user)
  try {
    const {
      title,
      slug,
      description,
      practiceType,
      difficulty,
      category,
      problemType,
      supportedLanguages,
      tags,
      starterCode,
      examples,
      constraints,
      testCases,
    } = req.body;

    console.log(title, slug, description)

    if (
      !title ||
      !slug ||
      !description ||
      !practiceType ||
      !difficulty ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, description, practice type, difficulty and category are required",
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
      practiceType,
      difficulty,
      category,
      problemType,
      supportedLanguages,
      tags,
      starterCode,
      examples,
      constraints,
      testCases,
      createdBy: req.user.id,
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


export const getAdminProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .select(
        "title slug practiceType problemType difficulty category tags supportedLanguages createdBy createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });

  } catch (error) {
    console.log("Error From Get Admin Problems:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin problems",
    });
  }
};


export const updateProblem = async (req, res) => {
  try {
    const { problemId, payload } = req.body;

    if (!problemId || !payload) {
      return res.status(400).json({
        success: false,
        message: "Problem Id and Payload are required",
      });
    }

    console.log("Update payload:", payload);

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    // Update basic fields
    if (payload.title !== undefined) {
      problem.title = payload.title;
    }

    if (payload.slug !== undefined) {
      problem.slug = payload.slug;
    }

    if (payload.description !== undefined) {
      problem.description = payload.description;
    }

    if (payload.difficulty !== undefined) {
      problem.difficulty = payload.difficulty;
    }

    if (payload.category !== undefined) {
      problem.category = payload.category;
    }

    if (payload.tags !== undefined) {
      problem.tags = payload.tags;
    }

    if (payload.constraints !== undefined) {
      problem.constraints = payload.constraints;
    }

    if (payload.starterCode !== undefined) {
      problem.starterCode = payload.starterCode;
    }

    if (payload.examples !== undefined) {
      problem.examples = payload.examples;
    }

    const updatedProblem = await problem.save();

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log("Update Problem Controllers error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A problem with this slug already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem Id is required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    await Problem.findByIdAndDelete(problemId);

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.log("Delete Problem Controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
