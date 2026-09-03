import mongoose from "mongoose";

const frontendFileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const frontendSubmissionSchema = new mongoose.Schema(
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

    files: {
      type: [frontendFileSchema],
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

export const FrontendSubmission = mongoose.model(
  "FrontendSubmission",
  frontendSubmissionSchema
);