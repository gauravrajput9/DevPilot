import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
        },

        expectedOutput: {
            type: String,
            required: true,
        },

        explanation: {
            type: String,
            default: "",
        },

        allowedLanguages: {
            type: [String],
            enum: ["javascript", "python", "cpp"],
            default: ["javascript"],
        },

        hidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
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
            default: "",
        },
    },
    {
        _id: true,
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
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
        },

        practiceType: {
            type: String,
            enum: ["coding", "frontend", "backend"],
            required: true,
            index: true,
        },


        category: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
            index: true,
        },

        problemType: {
            type: String,
            enum: ["single-file", "multi-file"],
            default: "single-file",
            index: true,
        },

        supportedLanguages: {
            type: [
                {
                    type: String,
                    enum: ["javascript", "python", "cpp"],
                },
            ],
            default: ["javascript"],
        },


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

        examples: {
            type: [exampleSchema],
            default: [],
        },

        constraints: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: String,
            required: true,
        },

        testCases: {
            type: [testCaseSchema],
            default: [],
        },
    },

    {
        timestamps: true,
    }
);

export const Problem = mongoose.model("Problem", problemSchema);
