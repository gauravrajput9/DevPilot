import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
        },

        allowedLanguages: {
            type: [String],
            enum: ["javascript", "python", "cpp", "java", "c", "go"],
            default: ["javascript"],
        },

        expectedOutput: {
            type: String,
            required: true,
        },

        hidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    }
);

const exampleSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
        },

        output: {
            type: String,
            required: true,
        },

        explanation: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        starterCode: {
            javascript: {
                type: String,
                default: "",
            },
            python: {
                type: String,
                default: "",
            },
            cpp: {
                type: String,
                default: "",
            },
        },

        examples: [exampleSchema],

        constraints: [
            {
                type: String,
            },
        ],

        testCases: [testCaseSchema],
    },
    {
        timestamps: true,
    }
);

export const Problem = mongoose.model("Problem", problemSchema);