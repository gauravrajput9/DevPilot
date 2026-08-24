import mongoose from "mongoose";

const userProblemSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["attempted", "solved"],
      default: "attempted",
    },

    attempts: {
      type: Number,
      default: 0,
    },

    solvedAt: {
      type: Date,
      default: null,
    },

    lastAttemptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userProblemSchema.index(
  { userId: 1, problemId: 1 },
  { unique: true }
);

export const UserProblem = mongoose.model(
  "UserProblem",
  userProblemSchema
);