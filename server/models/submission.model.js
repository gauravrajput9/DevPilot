import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    language: {
      type: String,
      required: true,
    },

    sourceCode: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "wrong_answer",
        "runtime_error",
        "compile_error",
        "time_limit",
        "memory_limit",
      ],
      default: "pending",
    },

    executionTime: {
      type: Number,
      default: null,
    },

    memory: {
      type: Number,
      default: null,
    },

    passedTests: {
      type: Number,
      default: 0,
    },

    totalTests: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Submission = mongoose.model(
  "Submission",
  submissionSchema
);