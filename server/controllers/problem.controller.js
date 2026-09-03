import { Problem } from "../models/problem.model.js";

/* =========================================================
   PUBLIC PROBLEM CONTROLLERS
========================================================= */

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

    if (language) {
      filters.$or = [
        { supportedLanguages: language },
        { "codingConfig.languages": language },
      ];
    }

    const problems = await Problem.find(filters)
      .select(
        "title slug description practiceType problemType difficulty category tags supportedLanguages starterCode examples constraints codingConfig createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    const normalizedProblems = problems.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      practiceType: p.practiceType,
      problemType: p.problemType,
      difficulty: p.difficulty,
      category: p.category,
      tags: p.tags,
      supportedLanguages:
        p.codingConfig?.languages ||
        p.supportedLanguages ||
        ["javascript"],
      starterCode:
        p.codingConfig?.starterCode ||
        p.starterCode ||
        {},
      examples: p.examples || [],
      constraints: p.constraints || [],
      createdAt: p.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: normalizedProblems.length,
      problems: normalizedProblems,
    });

  } catch (error) {
    console.error("Error From Get Problems:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
};


export const getProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .select(
        "title slug description practiceType problemType difficulty category tags starterCode supportedLanguages examples constraints testCases codingConfig frontendConfig backendConfig"
      )
      .lean();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const allTestCases =
      problem.codingConfig?.testCases ||
      problem.testCases ||
      [];

    const publicTestCases = allTestCases
      .filter((testCase) => !testCase.hidden)
      .map((testCase) => ({
        _id: testCase._id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        explanation: testCase.explanation,
        allowedLanguages: testCase.allowedLanguages,
      }));

    return res.status(200).json({
      success: true,
      problem: {
        _id: problem._id,
        title: problem.title,
        slug: problem.slug,
        description: problem.description,
        practiceType: problem.practiceType,
        problemType: problem.problemType,
        difficulty: problem.difficulty,
        category: problem.category,
        tags: problem.tags,
        supportedLanguages:
          problem.codingConfig?.languages ||
          problem.supportedLanguages ||
          ["javascript"],
        starterCode:
          problem.codingConfig?.starterCode ||
          problem.starterCode ||
          {},
        examples: problem.examples || [],
        constraints: problem.constraints || [],
        testCases: publicTestCases,
        codingConfig: problem.codingConfig,
        frontendConfig: problem.frontendConfig,
        backendConfig: problem.backendConfig,
      },
    });

  } catch (error) {
    console.error("Error from get Problem:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the required problem",
    });
  }
};


/* =========================================================
   ADMIN PROBLEM CONTROLLERS
========================================================= */

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      practiceType = "coding",
      difficulty,
      category,
      problemType = "single-file",
      supportedLanguages = ["javascript"],
      tags = [],
      starterCode = {},
      examples = [],
      constraints = [],
      testCases = [],
      codingConfig,
      frontendConfig,
      backendConfig,
    } = req.body;

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
        message:
          "Title, slug, description, practice type, difficulty and category are required",
      });
    }

    const existingProblem = await Problem.findOne({
      $or: [
        { slug: slug.trim().toLowerCase() },
        { title: title.trim() },
      ],
    });

    if (existingProblem) {
      if (existingProblem.slug === slug.trim().toLowerCase()) {
        return res.status(409).json({
          success: false,
          message: "A problem with this slug already exists",
        });
      }

      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists",
      });
    }

    const problemData = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description,
      practiceType,
      difficulty,
      category: category.trim().toLowerCase(),
      problemType,
      supportedLanguages,
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim().toLowerCase()) : [],
      starterCode,
      examples,
      constraints,
      testCases,
      createdBy: req.user.id,
    };

    if (practiceType === "coding") {
      problemData.codingConfig = codingConfig || {
        languages: supportedLanguages && supportedLanguages.length > 0
          ? supportedLanguages
          : ["javascript"],
        starterCode: starterCode || {},
        testCases: Array.isArray(testCases) ? testCases : [],
      };
    } else if (practiceType === "frontend") {
      problemData.frontendConfig = frontendConfig || {
        framework: "react",
        files: [],
        testCases: [],
      };
    } else if (practiceType === "backend") {
      problemData.backendConfig = backendConfig || {
        runtime: "node",
        files: [],
        testCases: [],
      };
    }

    const problem = await Problem.create(problemData);

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });

  } catch (error) {
    console.error("Create problem error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

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
        "title slug practiceType problemType difficulty category tags supportedLanguages codingConfig createdBy createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    const normalizedProblems = problems.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      practiceType: p.practiceType,
      problemType: p.problemType,
      difficulty: p.difficulty,
      category: p.category,
      tags: p.tags,
      supportedLanguages:
        p.codingConfig?.languages ||
        p.supportedLanguages ||
        ["javascript"],
      createdBy: p.createdBy,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      count: normalizedProblems.length,
      problems: normalizedProblems,
    });

  } catch (error) {
    console.error("Error From Get Admin Problems:", error);
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

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    if (payload.title !== undefined) problem.title = payload.title.trim();
    if (payload.slug !== undefined) problem.slug = payload.slug.trim().toLowerCase();
    if (payload.description !== undefined) problem.description = payload.description;
    if (payload.difficulty !== undefined) problem.difficulty = payload.difficulty;
    if (payload.category !== undefined) problem.category = payload.category.trim().toLowerCase();
    if (payload.tags !== undefined) problem.tags = payload.tags;
    if (payload.constraints !== undefined) problem.constraints = payload.constraints;
    if (payload.examples !== undefined) problem.examples = payload.examples;

    if (payload.supportedLanguages !== undefined) {
      problem.supportedLanguages = payload.supportedLanguages;
      if (!problem.codingConfig) problem.codingConfig = {};
      problem.codingConfig.languages = payload.supportedLanguages;
    }

    if (payload.starterCode !== undefined) {
      problem.starterCode = payload.starterCode;
      if (!problem.codingConfig) problem.codingConfig = {};
      problem.codingConfig.starterCode = payload.starterCode;
    }

    if (payload.codingConfig !== undefined) {
      problem.codingConfig = payload.codingConfig;
    }

    if (payload.frontendConfig !== undefined) {
      problem.frontendConfig = payload.frontendConfig;
    }

    if (payload.backendConfig !== undefined) {
      problem.backendConfig = payload.backendConfig;
    }

    const updatedProblem = await problem.save();

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });

  } catch (error) {
    console.error("Update Problem Controllers error:", error);

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
    console.error("Delete Problem Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
