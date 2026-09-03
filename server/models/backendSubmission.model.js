import mongoose from "mongoose";

const backendFileSchema = new mongoose.Schema(
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

const backendSubmissionSchema = new mongoose.Schema(
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
      type: [backendFileSchema],
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

export const BackendSubmission = mongoose.model(
  "BackendSubmission",
  backendSubmissionSchema
);