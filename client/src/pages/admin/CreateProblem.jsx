import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Code2, Layers, Cpu, Clock, HardDrive, CheckCircle2, AlertCircle, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createProblem } from "../../services/problemApi";
import { useToast } from "../../components/ui/ToastProvider";
import { DEFAULT_ARRAY_STARTER_CODE, DEFAULT_GENERAL_STARTER_CODE } from "../../constants/starterTemplates";
import SimpleStarterCodeGuide from "../../components/admin/SimpleStarterCodeGuide";

const panelClass =
  "rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm";
const labelClass = "mb-2 block text-sm font-medium text-zinc-300";
const helperClass = "mt-1.5 text-xs text-zinc-500";
const inputClass =
  "h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-violet-500/50 focus:bg-white/[0.05]";
const textareaClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-violet-500/50 focus:bg-white/[0.05]";
const selectClass =
  "h-11 rounded-lg border border-white/10 bg-[#08090d] px-4 text-sm text-white outline-none transition focus:border-violet-500/50";
const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white";
const iconButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300";

const AVAILABLE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const CreateProblem = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    practiceType: "coding",
    category: "",
    tags: [],
    difficulty: "easy",
    problemType: "single-file",

    // Coding specific
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    inputFormat:
      "The first line contains an integer N, the number of elements in the array.\nThe second line contains N space-separated integers.",
    outputFormat: "Print the required output to standard output (stdout).",
    timeLimit: 2000,
    memoryLimit: 128,
    starterCode: {
      ...DEFAULT_ARRAY_STARTER_CODE,
    },

    // Frontend specific
    frontendFramework: "react",
    frontendEntryFile: "src/main.jsx",
    frontendStartCommand: "npm run dev",
    frontendTimeLimit: 10000,

    // Backend specific
    backendRuntime: "node",
    backendEntryFile: "server.js",
    backendStartCommand: "node server.js",
    backendPort: 3001,
    backendTimeLimit: 10000,

    examples: [
      {
        input: "",
        output: "",
        explanation: "",
      },
    ],

    constraints: [""],
  });

  const [tagInput, setTagInput] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSlugAutoFill = (titleValue) => {
    const autoSlug = titleValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      title: titleValue,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleStarterCodeChange = (language, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [language]: value,
      },
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const exists = prev.supportedLanguages.includes(language);
      const nextLanguages = exists
        ? prev.supportedLanguages.filter((item) => item !== language)
        : [...prev.supportedLanguages, language];

      if (nextLanguages.length === 0) {
        toast.warning("At least one language must remain selected.");
        return prev;
      }

      return {
        ...prev,
        supportedLanguages: nextLanguages,
      };
    });
  };

  const handleLoadArrayTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      inputFormat:
        "The first line contains an integer N, the number of elements in the array.\nThe second line contains N space-separated integers.",
      outputFormat: "Print the required output to standard output (stdout).",
      starterCode: {
        ...prev.starterCode,
        ...DEFAULT_ARRAY_STARTER_CODE,
      },
    }));
    toast.success(
      "Loaded standard length-prefixed array template for all languages.",
      { title: "Template applied" }
    );
  };

  const handleApplySingleTemplate = (lang, code) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: code,
      },
    }));
    toast.success(`Applied template for ${lang === "cpp" ? "C++" : lang.toUpperCase()}`);
  };

  const handleApplyAllArrayTemplates = () => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode: {
        ...DEFAULT_ARRAY_STARTER_CODE,
      },
    }));
    toast.success("Applied array templates for all 4 languages.");
  };

  const handleApplyAllGeneralTemplates = () => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode: {
        ...DEFAULT_GENERAL_STARTER_CODE,
      },
    }));
    toast.success("Applied stream templates for all 4 languages.");
  };

  const handleApplyPatternAllLanguages = (starterCodes) => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode: {
        ...prev.starterCode,
        ...starterCodes,
      },
    }));
    toast.success("Loaded starter code for all 4 languages!");
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
      toast.warning("That tag is already added.", { title: "Duplicate tag" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleExampleChange = (index, field, value) => {
    setFormData((prev) => {
      const examples = [...prev.examples];
      examples[index] = {
        ...examples[index],
        [field]: value,
      };
      return { ...prev, examples };
    });
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [
        ...prev.examples,
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],
    }));
  };

  const removeExample = (index) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const handleConstraintChange = (index, value) => {
    setFormData((prev) => {
      const constraints = [...prev.constraints];
      constraints[index] = value;
      return { ...prev, constraints };
    });
  };

  const addConstraint = () => {
    setFormData((prev) => ({
      ...prev,
      constraints: [...prev.constraints, ""],
    }));
  };

  const removeConstraint = (index) => {
    setFormData((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description,
        practiceType: formData.practiceType,
        category: formData.category.trim().toLowerCase(),
        tags: formData.tags,
        difficulty: formData.difficulty,
        problemType: formData.problemType,
        constraints: formData.constraints.map((c) => c.trim()).filter(Boolean),
        examples: formData.examples.filter((ex) => ex.output?.trim()),
      };

      if (formData.practiceType === "coding") {
        const requiredLangs = ["javascript", "python", "cpp", "java"];
        const missing = requiredLangs.filter(
          (lang) => !formData.starterCode[lang] || !formData.starterCode[lang].trim()
        );

        if (missing.length > 0) {
          const names = missing
            .map((l) => (l === "cpp" ? "C++" : l.charAt(0).toUpperCase() + l.slice(1)))
            .join(", ");
          setSubmitting(false);
          toast.error(`Starter code is required for every language: ${names}`, {
            title: "Missing Starter Code",
          });
          const el = document.getElementById("starter-code-section");
          el?.scrollIntoView({ behavior: "smooth" });
          return;
        }

        payload.supportedLanguages = requiredLangs;
        payload.starterCode = formData.starterCode;
        payload.codingConfig = {
          languages: requiredLangs,
          inputFormat: formData.inputFormat,
          outputFormat: formData.outputFormat,
          starterCode: formData.starterCode,
          timeLimit: Number(formData.timeLimit) || 2000,
          memoryLimit: Number(formData.memoryLimit) || 128,
          testCases: [],
        };
      } else if (formData.practiceType === "frontend") {
        payload.frontendConfig = {
          framework: formData.frontendFramework,
          entryFile: formData.frontendEntryFile,
          startCommand: formData.frontendStartCommand,
          timeLimit: Number(formData.frontendTimeLimit) || 10000,
          files: [],
          testCases: [],
        };
      } else if (formData.practiceType === "backend") {
        payload.backendConfig = {
          runtime: formData.backendRuntime,
          entryFile: formData.backendEntryFile,
          startCommand: formData.backendStartCommand,
          port: Number(formData.backendPort) || 3001,
          timeLimit: Number(formData.backendTimeLimit) || 10000,
          files: [],
          testCases: [],
        };
      }

      const res = await createProblem(payload);
      const createdId = res.problem?._id || res.problem?.id;

      toast.success(
        "Problem created! Now configure test cases to evaluate user submissions.",
        { title: "Problem Created Successfully" }
      );

      if (createdId) {
        navigate(`/admin/problems/${createdId}/testcases`);
      } else {
        navigate("/admin/problems");
      }
    } catch (error) {
      console.error("Problem creation failed:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create problem.";
      setSubmitError(message);
      toast.error(message, { title: "Creation Failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link to="/admin/problems" className={secondaryButtonClass}>
          <ArrowLeft size={16} />
          Back to Problems
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Problem Builder
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Create Problem
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Configure problem details, practice type, specifications, and starter code.
        </p>
      </div>

      {submitError && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Practice Type & Category */}
        <section className={panelClass}>
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
            <Layers size={18} className="text-violet-400" />
            Core Classification
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Practice Type</label>
              <select
                name="practiceType"
                value={formData.practiceType}
                onChange={handleChange}
                className={`${selectClass} w-full`}
              >
                <option value="coding">Coding (Algorithm / DSA)</option>
                <option value="frontend">Frontend (Web / UI)</option>
                <option value="backend">Backend (API / Service)</option>
              </select>
              <p className={helperClass}>Defines the execution environment.</p>
            </div>

            <div>
              <label className={labelClass}>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={`${selectClass} w-full`}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <p className={helperClass}>Challenge level for learners.</p>
            </div>

            <div>
              <label className={labelClass}>Problem Type</label>
              <select
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className={`${selectClass} w-full`}
              >
                <option value="single-file">Single File</option>
                <option value="multi-file">Multi File Project</option>
              </select>
              <p className={helperClass}>Workspace file layout.</p>
            </div>
          </div>
        </section>

        {/* Basic Details */}
        <section className={panelClass}>
          <h2 className="mb-6 text-lg font-semibold text-white">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleSlugAutoFill(e.target.value)}
                placeholder="e.g. Two Sum"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Slug (URL Identifier)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. two-sum"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. arrays, dynamic-programming, auth"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="e.g. hash-table, two-pointers"
                  className={`${inputClass} flex-1`}
                />
                <button type="button" onClick={addTag} className={secondaryButtonClass}>
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-violet-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the problem, input format, and output requirements in detail..."
              className={textareaClass}
              required
            />
          </div>
        </section>

        {/* CODING CONFIGURATION */}
        {formData.practiceType === "coding" && (
          <section className={panelClass}>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
              <Code2 size={18} className="text-violet-400" />
              Coding Configuration
            </h2>
            <p className="mb-6 text-sm text-zinc-500">
              Languages, execution constraints, and input/output specifications.
            </p>

            {/* Input Length Protocol Banner */}
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertCircle size={16} />
                  <span>Standard Input Convention: Provide Input Length (N) on Line 1</span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadArrayTemplate}
                  className="rounded-lg border border-amber-500/40 bg-black/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
                >
                  Load Length-Prefixed Array Template
                </button>
              </div>
              <p className="leading-relaxed text-amber-200/90">
                To guarantee zero inconsistencies across languages, always structure array inputs so that Line 1 gives the length <code>N</code> and Line 2 gives the space-separated elements. This prevents C++ and Java from reading garbage memory or throwing <code>std::length_error</code>.
              </p>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Allowed Languages</label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_LANGUAGES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]"
                  >
                    <input
                      type="checkbox"
                      checked={formData.supportedLanguages.includes(value)}
                      onChange={() => handleLanguageChange(value)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-600"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-zinc-500" />
                    Time Limit (ms)
                  </span>
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min={100}
                  className={inputClass}
                />
                <p className={helperClass}>Default is 2000 ms.</p>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={14} className="text-zinc-500" />
                    Memory Limit (MB)
                  </span>
                </label>
                <input
                  type="number"
                  name="memoryLimit"
                  value={formData.memoryLimit}
                  onChange={handleChange}
                  min={16}
                  className={inputClass}
                />
                <p className={helperClass}>Default is 128 MB.</p>
              </div>

              <div>
                <label className={labelClass}>Input Format Specification</label>
                <textarea
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. First line contains integer N. Second line contains N space-separated integers."
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>Output Format Specification</label>
                <textarea
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Print two space-separated indices."
                  className={textareaClass}
                />
              </div>
            </div>
          </section>
        )}

        {/* FRONTEND CONFIGURATION */}
        {formData.practiceType === "frontend" && (
          <section className={panelClass}>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
              <Layers size={18} className="text-violet-400" />
              Frontend Configuration
            </h2>
            <p className="mb-6 text-sm text-zinc-500">
              Web build settings, framework, and entry point.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Framework</label>
                <select
                  name="frontendFramework"
                  value={formData.frontendFramework}
                  onChange={handleChange}
                  className={`${selectClass} w-full`}
                >
                  <option value="react">React</option>
                  <option value="html-css-js">HTML / CSS / Vanilla JS</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Entry File</label>
                <input
                  type="text"
                  name="frontendEntryFile"
                  value={formData.frontendEntryFile}
                  onChange={handleChange}
                  placeholder="src/main.jsx"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Start Command</label>
                <input
                  type="text"
                  name="frontendStartCommand"
                  value={formData.frontendStartCommand}
                  onChange={handleChange}
                  placeholder="npm run dev"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Build Time Limit (ms)</label>
                <input
                  type="number"
                  name="frontendTimeLimit"
                  value={formData.frontendTimeLimit}
                  onChange={handleChange}
                  min={1000}
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        )}

        {/* BACKEND CONFIGURATION */}
        {formData.practiceType === "backend" && (
          <section className={panelClass}>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
              <Cpu size={18} className="text-violet-400" />
              Backend Configuration
            </h2>
            <p className="mb-6 text-sm text-zinc-500">
              Server runtime, port, and entry file settings.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Runtime</label>
                <select
                  name="backendRuntime"
                  value={formData.backendRuntime}
                  onChange={handleChange}
                  className={`${selectClass} w-full`}
                >
                  <option value="node">Node.js</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Server Port</label>
                <input
                  type="number"
                  name="backendPort"
                  value={formData.backendPort}
                  onChange={handleChange}
                  min={1024}
                  max={65535}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Entry File</label>
                <input
                  type="text"
                  name="backendEntryFile"
                  value={formData.backendEntryFile}
                  onChange={handleChange}
                  placeholder="server.js"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Start Command</label>
                <input
                  type="text"
                  name="backendStartCommand"
                  value={formData.backendStartCommand}
                  onChange={handleChange}
                  placeholder="node server.js"
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        )}

        {/* STARTER CODE (CODING) */}
        {formData.practiceType === "coding" && (
          <section id="starter-code-section" className={`${panelClass} space-y-6`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Starter Code Configuration</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Starter code is <strong className="text-white">required for all 4 supported languages</strong> (JavaScript, Python, C++, Java) to guarantee learners can solve problems in their preferred language.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyAllArrayTemplates}
                    className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20"
                  >
                    Load All Array Templates
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAllGeneralTemplates}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Load All Stream Templates
                  </button>
                </div>
              </div>
            </div>

            {/* Simple Data Structure Starter Code & Test Case Guide */}
            <SimpleStarterCodeGuide
              onApplyAllLanguages={handleApplyPatternAllLanguages}
              onApplySingleLanguage={handleApplySingleTemplate}
            />

            {/* Language Starter Code Editors */}
            <div className="space-y-5">
              {AVAILABLE_LANGUAGES.map(({ value: lang, label }) => {
                const code = formData.starterCode[lang] || "";
                const isProvided = Boolean(code.trim());

                return (
                  <div
                    key={lang}
                    className={`rounded-xl border p-4 transition ${
                      isProvided
                        ? "border-white/10 bg-black/20"
                        : "border-amber-500/30 bg-amber-500/[0.02]"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white">
                          {label}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          main.{lang === "javascript" ? "js" : lang === "python" ? "py" : lang}
                        </span>
                        {isProvided ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                            <Check size={11} /> Provided
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400">
                            <AlertCircle size={11} /> Required
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleApplySingleTemplate(
                              lang,
                              DEFAULT_ARRAY_STARTER_CODE[lang]
                            )
                          }
                          className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          Array Template
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleApplySingleTemplate(
                              lang,
                              DEFAULT_GENERAL_STARTER_CODE[lang]
                            )
                          }
                          className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          Stream Template
                        </button>
                        {code && (
                          <button
                            type="button"
                            onClick={() => handleStarterCodeChange(lang, "")}
                            className="rounded border border-white/5 px-2 py-1 text-[11px] text-zinc-500 hover:text-rose-400 transition"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={7}
                      value={code}
                      onChange={(e) => handleStarterCodeChange(lang, e.target.value)}
                      placeholder={`// Provide ${label} starter boilerplate here...\n// Read input from stdin and write output to stdout.`}
                      className="w-full resize-y rounded-lg border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-zinc-200 outline-none focus:border-violet-500/50"
                      required
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* EXAMPLES */}
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Examples</h2>
              <p className="text-sm text-zinc-500">
                Examples displayed in the problem description to guide learners.
              </p>
            </div>
            <button type="button" onClick={addExample} className={secondaryButtonClass}>
              <Plus size={16} />
              Add Example
            </button>
          </div>

          <div className="space-y-4">
            {formData.examples.map((example, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Example {index + 1}</span>
                  {formData.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-xs text-zinc-600 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Input</label>
                    <textarea
                      rows={3}
                      value={example.input}
                      onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                      placeholder="e.g. nums = [2,7,11,15], target = 9"
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Output</label>
                    <textarea
                      rows={3}
                      value={example.output}
                      onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                      placeholder="e.g. [0,1]"
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className={labelClass}>Explanation (Optional)</label>
                  <input
                    type="text"
                    value={example.explanation}
                    onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                    placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSTRAINTS */}
        <section className={panelClass}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Constraints</h2>
              <p className="text-sm text-zinc-500">
                Boundaries and guarantees for input size and values.
              </p>
            </div>
            <button type="button" onClick={addConstraint} className={secondaryButtonClass}>
              <Plus size={16} />
              Add Constraint
            </button>
          </div>

          <div className="space-y-3">
            {formData.constraints.map((constraint, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => handleConstraintChange(index, e.target.value)}
                  placeholder="e.g. 2 <= nums.length <= 10^4"
                  className={inputClass}
                />
                {formData.constraints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className={iconButtonClass}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
          <Link to="/admin/problems" className={secondaryButtonClass}>
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            <CheckCircle2 size={16} />
            {submitting ? "Creating Problem..." : "Create & Add Test Cases"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;
