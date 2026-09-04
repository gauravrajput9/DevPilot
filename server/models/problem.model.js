import mongoose from "mongoose";

/* =========================================================
   COMMON SCHEMAS
========================================================= */

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
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


/* =========================================================
   CODING
========================================================= */

const codingStarterCodeSchema = new mongoose.Schema(
  {
    javascript: {
      type: String,
      required: [true, "JavaScript starter code is required"],
      trim: true,
    },

    python: {
      type: String,
      required: [true, "Python starter code is required"],
      trim: true,
    },

    cpp: {
      type: String,
      required: [true, "C++ starter code is required"],
      trim: true,
    },

    java: {
      type: String,
      required: [true, "Java starter code is required"],
      trim: true,
    },
  },
  {
    _id: false,
  }
);


const codingTestCaseSchema = new mongoose.Schema(
  {
    /*
     * raw stdin text. Example: "5\n10 20 30 40 50"
     */
    input: {
      type: String,
      required: true,
      default: "",
    },

    /*
     * Expected stdout.
     */
    expectedOutput: {
      type: String,
      required: true,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    allowedLanguages: {
      type: [
        {
          type: String,
          enum: ["javascript", "python", "cpp", "java"],
        },
      ],

      default: ["javascript"],

      validate: {
        validator: function (languages) {
          return Array.isArray(languages) && languages.length > 0;
        },

        message: "At least one allowed language is required",
      },
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


const codingConfigSchema = new mongoose.Schema(
  {
    languages: {
      type: [
        {
          type: String,
          enum: ["javascript", "python", "cpp", "java"],
        },
      ],

      default: ["javascript"],

      validate: {
        validator: function (languages) {
          return Array.isArray(languages) && languages.length > 0;
        },

        message: "At least one coding language is required",
      },
    },

    inputFormat: {
      type: String,
      default: "",
    },

    outputFormat: {
      type: String,
      default: "",
    },

    starterCode: {
      type: codingStarterCodeSchema,
      default: () => ({}),
    },

    testCases: {
      type: [codingTestCaseSchema],
      default: [],
    },

    timeLimit: {
      type: Number,
      default: 2000,
      min: 100,
    },

    memoryLimit: {
      type: Number,
      default: 128,
      min: 16,
    },
  },
  {
    _id: false,
  }
);


/* =========================================================
   SHARED PROJECT FILE
========================================================= */

const projectFileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);


/* =========================================================
   FRONTEND
========================================================= */

const frontendTestCaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "element",
        "text",
        "attribute",
        "style",
        "interaction",
        "custom",
      ],
      required: true,
    },

    selector: {
      type: String,
      default: "",
    },

    expected: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    action: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    hidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);


const frontendConfigSchema = new mongoose.Schema(
  {
    framework: {
      type: String,
      enum: ["html-css-js", "react"],
      default: "react",
    },

    files: {
      type: [projectFileSchema],
      default: [],
    },

    entryFile: {
      type: String,
      default: "src/main.jsx",
    },

    startCommand: {
      type: String,
      default: "npm run dev",
    },

    testCases: {
      type: [frontendTestCaseSchema],
      default: [],
    },

    timeLimit: {
      type: Number,
      default: 10000,
      min: 1000,
    },
  },
  {
    _id: false,
  }
);


/* =========================================================
   BACKEND
========================================================= */

const backendTestCaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      required: true,
    },

    path: {
      type: String,
      required: true,
      trim: true,
    },

    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    body: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    expectedStatus: {
      type: Number,
      required: true,
    },

    expectedBody: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    hidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);


const backendConfigSchema = new mongoose.Schema(
  {
    runtime: {
      type: String,
      enum: ["node"],
      default: "node",
    },

    files: {
      type: [projectFileSchema],
      default: [],
    },

    entryFile: {
      type: String,
      default: "server.js",
    },

    startCommand: {
      type: String,
      default: "node server.js",
    },

    port: {
      type: Number,
      default: 3001,
      min: 1024,
      max: 65535,
    },

    testCases: {
      type: [backendTestCaseSchema],
      default: [],
    },

    timeLimit: {
      type: Number,
      default: 10000,
      min: 1000,
    },
  },
  {
    _id: false,
  }
);


/* =========================================================
   MAIN PROBLEM
========================================================= */

const problemSchema = new mongoose.Schema(
  {
    /* -----------------------------------------------------
       COMMON
    ----------------------------------------------------- */

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
      index: true,
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
      index: true,
    },

    /* -----------------------------------------------------
       FLAT COMPATIBILITY FIELDS
       (automatically synchronized with codingConfig)
    ----------------------------------------------------- */

    starterCode: {
      type: codingStarterCodeSchema,
      required: false,
    },

    supportedLanguages: {
      type: [String],
      required: false,
    },

    testCases: {
      type: [codingTestCaseSchema],
      required: false,
    },

    /* -----------------------------------------------------
       TYPE-SPECIFIC CONFIGURATION
    ----------------------------------------------------- */

    codingConfig: {
      type: codingConfigSchema,
      default: undefined,
    },

    frontendConfig: {
      type: frontendConfigSchema,
      default: undefined,
    },

    backendConfig: {
      type: backendConfigSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


/* =========================================================
   SYNCHRONIZATION & VALIDATION HOOKS
========================================================= */

/*
 * Synchronize flat compatibility fields with codingConfig before validation.
 */
problemSchema.pre("validate", function () {
  if (this.practiceType === "coding") {
    const requiredLanguages = ["javascript", "python", "cpp", "java"];

    if (!this.codingConfig) {
      this.codingConfig = {
        languages:
          this.supportedLanguages && this.supportedLanguages.length > 0
            ? this.supportedLanguages
            : requiredLanguages,
        starterCode: this.starterCode || {},
        testCases: Array.isArray(this.testCases) ? this.testCases : [],
      };
    } else {
      // Sync flat fields into codingConfig if provided
      if (
        this.supportedLanguages &&
        this.supportedLanguages.length > 0 &&
        (!this.codingConfig.languages || this.codingConfig.languages.length === 0)
      ) {
        this.codingConfig.languages = this.supportedLanguages;
      }
      if (
        this.starterCode &&
        (!this.codingConfig.starterCode ||
          Object.keys(this.codingConfig.starterCode).length === 0)
      ) {
        this.codingConfig.starterCode = this.starterCode;
      }
      if (
        Array.isArray(this.testCases) &&
        this.testCases.length > 0 &&
        (!this.codingConfig.testCases ||
          this.codingConfig.testCases.length === 0)
      ) {
        this.codingConfig.testCases = this.testCases;
      }
    }

    const starter = this.codingConfig.starterCode || this.starterCode || {};
    for (const lang of requiredLanguages) {
      if (!starter[lang] || !String(starter[lang]).trim()) {
        throw new Error(
          `Starter code must be provided for every language that the application uses: ${lang} is missing`
        );
      }
    }

    // Mirror back to flat fields for consistent reads
    this.starterCode = this.codingConfig.starterCode || this.starterCode;
    this.supportedLanguages =
      this.codingConfig.languages || requiredLanguages;
    this.testCases = this.codingConfig.testCases || this.testCases;
  }

  if (this.practiceType === "frontend") {
    if (!this.frontendConfig) {
      throw new Error("frontendConfig is required for frontend problems");
    }
  }

  if (this.practiceType === "backend") {
    if (!this.backendConfig) {
      throw new Error("backendConfig is required for backend problems");
    }
  }
});


/* =========================================================
   MODEL
========================================================= */

export const Problem = mongoose.model("Problem", problemSchema);
