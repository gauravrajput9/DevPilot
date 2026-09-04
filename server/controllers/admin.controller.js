import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";
import { CodingSubmission } from "../models/codingSubmission.model.js";
import { executeCode } from "../services/piston.service.js";
import { PISTON_LANGUAGES, SUPPORTED_LANGUAGES } from "../config/languages.js";

const getUserCollection = () => {
  return mongoose.connection.db.collection("user");
};

const buildUserQuery = (userId) => {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    return {
      $or: [{ _id: new mongoose.Types.ObjectId(userId) }, { _id: String(userId) }],
    };
  }
  return { _id: String(userId) };
};

/* =========================================================
   USERS MANAGEMENT
========================================================= */

export const getAdminUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const { search, role, status } = req.query;

    const query = {};

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      query.$or = [{ name: reg }, { email: reg }];
    }

    if (role && role !== "all") {
      query.role = role.trim().toLowerCase();
    }

    if (status === "banned") {
      query.banned = true;
    } else if (status === "active") {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { banned: { $exists: false } },
            { banned: false },
            { banned: null },
          ],
        },
      ];
    }

    const userCollection = getUserCollection();
    const total = await userCollection.countDocuments(query);
    const rawUsers = await userCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Collect user string IDs for submission aggregation
    const userIds = rawUsers.map((u) => String(u._id));

    const submissionCounts = await CodingSubmission.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    for (const item of submissionCounts) {
      countMap[String(item._id)] = item.count;
    }

    const users = rawUsers.map((u) => ({
      id: String(u._id),
      _id: String(u._id),
      name: u.name || "Anonymous",
      email: u.email || "",
      image: u.image || null,
      role: u.role || "user",
      banned: Boolean(u.banned),
      emailVerified: Boolean(u.emailVerified),
      submissionCount: countMap[String(u._id)] || 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Valid role ('admin' or 'user') is required",
      });
    }

    const targetRole = role.toLowerCase();

    // Prevent self demotion if current user is demoting themselves
    if (String(req.user?.id) === String(userId) && targetRole === "user") {
      const userCollection = getUserCollection();
      const adminCount = await userCollection.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot demote the only remaining administrator",
        });
      }
    }

    const userCollection = getUserCollection();
    const query = buildUserQuery(userId);

    const result = await userCollection.updateOne(query, {
      $set: {
        role: targetRole,
        updatedAt: new Date(),
      },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${targetRole}`,
    });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

export const toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { banned } = req.body;

    if (banned === undefined) {
      return res.status(400).json({
        success: false,
        message: "'banned' boolean value is required",
      });
    }

    if (String(req.user?.id) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot ban their own account",
      });
    }

    const userCollection = getUserCollection();
    const query = buildUserQuery(userId);

    const result = await userCollection.updateOne(query, {
      $set: {
        banned: Boolean(banned),
        updatedAt: new Date(),
      },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: banned ? "User has been banned" : "User ban has been lifted",
      banned: Boolean(banned),
    });
  } catch (error) {
    console.error("toggleUserBan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

/* =========================================================
   SUBMISSIONS MANAGEMENT
========================================================= */

export const getAdminSubmissions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const { status, language, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status.trim().toLowerCase();
    }

    if (language && language !== "all") {
      query.language = language.trim().toLowerCase();
    }

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), "i");
      // Find matching problems or users
      const matchingProblems = await Problem.find({ title: reg }).select("_id").lean();
      const problemIds = matchingProblems.map((p) => p._id);

      const userCollection = getUserCollection();
      const matchingUsers = await userCollection
        .find({ $or: [{ name: reg }, { email: reg }] })
        .project({ _id: 1 })
        .toArray();
      const userIds = matchingUsers.map((u) => String(u._id));

      query.$or = [
        { problemId: { $in: problemIds } },
        { userId: { $in: userIds } },
      ];
    }

    const total = await CodingSubmission.countDocuments(query);
    const submissions = await CodingSubmission.find(query)
      .populate("problemId", "title slug difficulty practiceType category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Populate user info for each submission
    const userIds = [...new Set(submissions.map((s) => String(s.userId)).filter(Boolean))];
    const userCollection = getUserCollection();
    const users = await userCollection
      .find({
        $or: userIds.map((id) =>
          mongoose.Types.ObjectId.isValid(id)
            ? { _id: new mongoose.Types.ObjectId(id) }
            : { _id: id }
        ),
      })
      .project({ _id: 1, name: 1, email: 1, image: 1 })
      .toArray();

    const userMap = {};
    for (const u of users) {
      userMap[String(u._id)] = {
        name: u.name || "Anonymous",
        email: u.email || "",
        image: u.image || null,
      };
    }

    const normalizedSubmissions = submissions.map((s) => ({
      _id: s._id,
      id: s._id,
      userId: s.userId,
      user: userMap[String(s.userId)] || { name: "User #" + String(s.userId).slice(-4), email: "" },
      problemId: s.problemId?._id || s.problemId,
      problem: s.problemId || { title: "Deleted Problem", difficulty: "unknown" },
      language: s.language,
      status: s.status,
      executionTime: s.executionTime,
      memory: s.memory,
      passedTests: s.passedTests,
      totalTests: s.totalTests,
      createdAt: s.createdAt,
    }));

    return res.status(200).json({
      success: true,
      submissions: normalizedSubmissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("getAdminSubmissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
};

export const getAdminSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
    }

    const submission = await CodingSubmission.findById(id)
      .populate("problemId", "title slug difficulty practiceType category inputFormat outputFormat")
      .lean();

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    const userCollection = getUserCollection();
    const user = await userCollection.findOne(buildUserQuery(submission.userId));

    return res.status(200).json({
      success: true,
      submission: {
        ...submission,
        user: user
          ? { name: user.name, email: user.email, image: user.image }
          : { name: "User #" + String(submission.userId).slice(-4), email: "" },
      },
    });
  } catch (error) {
    console.error("getAdminSubmissionById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submission details",
      error: error.message,
    });
  }
};

/* =========================================================
   ANALYTICS & METRICS
========================================================= */

export const getAdminAnalytics = async (req, res) => {
  try {
    const userCollection = getUserCollection();

    // 1. Users metrics
    const [totalUsers, adminCount, bannedCount] = await Promise.all([
      userCollection.countDocuments({}),
      userCollection.countDocuments({ role: "admin" }),
      userCollection.countDocuments({ banned: true }),
    ]);

    // 2. Problems metrics
    const [totalProblems, problemsByPracticeType, problemsByDifficulty] = await Promise.all([
      Problem.countDocuments({}),
      Problem.aggregate([
        { $group: { _id: "$practiceType", count: { $sum: 1 } } },
      ]),
      Problem.aggregate([
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
    ]);

    // 3. Submissions metrics
    const [
      totalSubmissions,
      acceptedSubmissions,
      statusBreakdown,
      languageBreakdown,
      recentRawSubmissions,
    ] = await Promise.all([
      CodingSubmission.countDocuments({}),
      CodingSubmission.countDocuments({ status: "accepted" }),
      CodingSubmission.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CodingSubmission.aggregate([
        { $group: { _id: "$language", count: { $sum: 1 } } },
      ]),
      CodingSubmission.find({})
        .populate("problemId", "title difficulty practiceType")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const acceptanceRate =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
        : "0.0";

    // Format breakdown dictionaries
    const statusMap = {};
    for (const s of statusBreakdown) {
      statusMap[s._id] = s.count;
    }

    const languageMap = {};
    for (const l of languageBreakdown) {
      languageMap[l._id] = l.count;
    }

    const practiceTypeMap = { coding: 0, frontend: 0, backend: 0 };
    for (const p of problemsByPracticeType) {
      if (p._id) practiceTypeMap[p._id] = p.count;
    }

    const difficultyMap = { easy: 0, medium: 0, hard: 0 };
    for (const d of problemsByDifficulty) {
      if (d._id) difficultyMap[d._id] = d.count;
    }

    // Populate user info for recent submissions
    const recentUserIds = [
      ...new Set(recentRawSubmissions.map((s) => String(s.userId)).filter(Boolean)),
    ];
    const recentUsers = await userCollection
      .find({
        $or: recentUserIds.map((id) =>
          mongoose.Types.ObjectId.isValid(id)
            ? { _id: new mongoose.Types.ObjectId(id) }
            : { _id: id }
        ),
      })
      .project({ _id: 1, name: 1, email: 1 })
      .toArray();

    const recentUserMap = {};
    for (const u of recentUsers) {
      recentUserMap[String(u._id)] = u.name || u.email || "Anonymous";
    }

    const recentSubmissions = recentRawSubmissions.map((s) => ({
      _id: s._id,
      problemTitle: s.problemId?.title || "Problem",
      difficulty: s.problemId?.difficulty || "easy",
      userName: recentUserMap[String(s.userId)] || "User #" + String(s.userId).slice(-4),
      language: s.language,
      status: s.status,
      createdAt: s.createdAt,
    }));

    return res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          admins: adminCount,
          regular: Math.max(0, totalUsers - adminCount),
          banned: bannedCount,
          active: Math.max(0, totalUsers - bannedCount),
        },
        problems: {
          total: totalProblems,
          byPracticeType: practiceTypeMap,
          byDifficulty: difficultyMap,
        },
        submissions: {
          total: totalSubmissions,
          accepted: acceptedSubmissions,
          acceptanceRate: Number(acceptanceRate),
          byStatus: statusMap,
          byLanguage: languageMap,
        },
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error("getAdminAnalytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

/* =========================================================
   SETTINGS & DIAGNOSTICS
========================================================= */

export const getAdminSettings = async (req, res) => {
  try {
    const pistonUrl = process.env.PISTON_URL || "http://localhost:2000";

    return res.status(200).json({
      success: true,
      settings: {
        platform: {
          name: "DevPilot",
          version: "1.0.0",
          nodeEnv: process.env.NODE_ENV || "development",
          nodeVersion: process.version,
          dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        },
        piston: {
          url: pistonUrl,
          supportedLanguages: SUPPORTED_LANGUAGES,
          languageConfigs: PISTON_LANGUAGES,
        },
        defaults: {
          timeLimit: 2000,
          memoryLimit: 128,
        },
      },
    });
  } catch (error) {
    console.error("getAdminSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

export const testPistonHealth = async (req, res) => {
  const startTime = Date.now();
  try {
    const result = await executeCode({
      language: "javascript",
      sourceCode: "console.log('piston-healthy');",
    });

    const latencyMs = Date.now() - startTime;
    const isHealthy = result?.run?.stdout?.includes("piston-healthy");

    return res.status(200).json({
      success: isHealthy,
      status: isHealthy ? "online" : "degraded",
      latencyMs,
      pistonResponse: {
        language: result?.language,
        version: result?.version,
      },
      message: isHealthy
        ? "Piston execution engine is online and responding normally."
        : "Piston responded but returned unexpected output.",
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    return res.status(200).json({
      success: false,
      status: "offline",
      latencyMs,
      error: error.response?.data?.message || error.message,
      message: "Piston execution engine is offline or unreachable.",
    });
  }
};
