import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Plus, ArrowLeft, Code2, Layers, Cpu, Clock, HardDrive, CheckCircle2, ListChecks } from "lucide-react";
import { getProblem, updateProblem } from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const panelClass =
  "rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm";
const labelClass = "mb-2 block text-sm font-medium text-zinc-300";
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

const AVAILABLE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const EditProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    practiceType: "coding",
    difficulty: "easy",
    category: "",
    problemType: "single-file",
    tags: "",
    constraints: "",

    // Coding specific
    supportedLanguages: ["javascript", "python"],
    inputFormat: "",
    outputFormat: "",
    timeLimit: 2000,
    memoryLimit: 128,
    starterCode: {
      javascript: "",
      python: "",
      cpp: "",
      java: "",
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
  });

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getProblem(problemId);
      const problem = res.problem;

      const practiceType = problem.practiceType || "coding";
      const codingConfig = problem.codingConfig || {};
      const frontendConfig = problem.frontendConfig || {};
      const backendConfig = problem.backendConfig || {};

      setFormData({
        title: problem.title || "",
        slug: problem.slug || "",
        description: problem.description || "",
        practiceType,
        difficulty: problem.difficulty || "easy",
        category: problem.category || "",
        problemType: problem.problemType || "single-file",
        tags: Array.isArray(problem.tags) ? problem.tags.join(", ") : "",
        constraints: Array.isArray(problem.constraints) ? problem.constraints.join("\n") : "",

        supportedLanguages:
          codingConfig.languages ||
          problem.supportedLanguages ||
          ["javascript", "python"],
        inputFormat: codingConfig.inputFormat || "",
        outputFormat: codingConfig.outputFormat || "",
        timeLimit: codingConfig.timeLimit || 2000,
        memoryLimit: codingConfig.memoryLimit || 128,
        starterCode: {
          javascript: codingConfig.starterCode?.javascript || problem.starterCode?.javascript || "",
          python: codingConfig.starterCode?.python || problem.starterCode?.python || "",
          cpp: codingConfig.starterCode?.cpp || problem.starterCode?.cpp || "",
          java: codingConfig.starterCode?.java || problem.starterCode?.java || "",
        },

        frontendFramework: frontendConfig.framework || "react",
        frontendEntryFile: frontendConfig.entryFile || "src/main.jsx",
        frontendStartCommand: frontendConfig.startCommand || "npm run dev",
        frontendTimeLimit: frontendConfig.timeLimit || 10000,

        backendRuntime: backendConfig.runtime || "node",
        backendEntryFile: backendConfig.entryFile || "server.js",
        backendStartCommand: backendConfig.startCommand || "node server.js",
        backendPort: backendConfig.port || 3001,
        backendTimeLimit: backendConfig.timeLimit || 10000,

        examples:
          problem.examples && problem.examples.length > 0
            ? problem.examples
            : [
                {
                  input: "",
                  output: "",
                  explanation: "",
                },
              ],
      });
    } catch (error) {
      console.error("Error loading problem:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load this problem.";
      setLoadError(message);
      toast.error(message, { title: "Unable to load problem" });
    } finally {
      setLoading(false);
    }
  }, [problemId, toast]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProblem());
  }, [fetchProblem]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
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

  const handleStarterCodeChange = (language, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [language]: value,
      },
    }));
  };

  const handleExampleChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedExamples = [...prev.examples];
      updatedExamples[index] = {
        ...updatedExamples[index],
        [field]: value,
      };
      return { ...prev, examples: updatedExamples };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description,
        practiceType: formData.practiceType,
        difficulty: formData.difficulty,
        category: formData.category.trim().toLowerCase(),
        problemType: formData.problemType,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
        constraints: formData.constraints
          .split("\n")
          .map((c) => c.trim())
          .filter(Boolean),
        examples: formData.examples.filter((ex) => ex.output?.trim()),
      };

      if (formData.practiceType === "coding") {
        payload.supportedLanguages = formData.supportedLanguages;
        payload.starterCode = formData.starterCode;
        payload.codingConfig = {
          languages: formData.supportedLanguages,
          inputFormat: formData.inputFormat,
          outputFormat: formData.outputFormat,
          starterCode: formData.starterCode,
          timeLimit: Number(formData.timeLimit) || 2000,
          memoryLimit: Number(formData.memoryLimit) || 128,
        };
      } else if (formData.practiceType === "frontend") {
        payload.frontendConfig = {
          framework: formData.frontendFramework,
          entryFile: formData.frontendEntryFile,
          startCommand: formData.frontendStartCommand,
          timeLimit: Number(formData.frontendTimeLimit) || 10000,
        };
      } else if (formData.practiceType === "backend") {
        payload.backendConfig = {
          runtime: formData.backendRuntime,
          entryFile: formData.backendEntryFile,
          startCommand: formData.backendStartCommand,
          port: Number(formData.backendPort) || 3001,
          timeLimit: Number(formData.backendTimeLimit) || 10000,
        };
      }

      await updateProblem(problemId, payload);
      toast.success("Problem changes saved successfully.", { title: "Saved" });
      navigate("/admin/problems");
    } catch (error) {
      console.error("Update problem error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save changes.";
      setSaveError(message);
      toast.error(message, { title: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoading label="Loading problem..." />;
  }

  if (loadError) {
    return (
      <PageError
        title="Problem could not be loaded"
        message={loadError}
        onAction={fetchProblem}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/problems"
          className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to problems
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Problem Editor
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Edit Problem
            </h1>
            <p className="mt-1 text-xs text-zinc-500">ID: {problemId}</p>
          </div>

          <Link
            to={`/admin/problems/${problemId}/testcases`}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 hover:text-white"
          >
            <ListChecks size={16} />
            Manage Test Cases
          </Link>
        </div>
      </div>

      {saveError && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Classification */}
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
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className={panelClass}>
          <h2 className="mb-6 text-lg font-semibold text-white">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
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
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="arrays, two-pointers, math"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
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
              </div>

              <div>
                <label className={labelClass}>Input Format</label>
                <textarea
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleChange}
                  rows={3}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={labelClass}>Output Format</label>
                <textarea
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleChange}
                  rows={3}
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
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        )}

        {/* STARTER CODE */}
        {formData.practiceType === "coding" && (
          <section className={panelClass}>
            <h2 className="mb-2 text-lg font-semibold text-white">Starter Code</h2>
            <div className="space-y-4">
              {formData.supportedLanguages.map((lang) => (
                <div key={lang} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={formData.starterCode[lang] || ""}
                    onChange={(e) => handleStarterCodeChange(lang, e.target.value)}
                    className="w-full resize-y rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-zinc-200 outline-none focus:border-violet-500/50"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXAMPLES */}
        <section className={panelClass}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Examples</h2>
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
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Output</label>
                    <textarea
                      rows={3}
                      value={example.output}
                      onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className={labelClass}>Explanation</label>
                  <input
                    type="text"
                    value={example.explanation || ""}
                    onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSTRAINTS */}
        <section className={panelClass}>
          <h2 className="mb-2 text-lg font-semibold text-white">Constraints</h2>
          <p className="mb-4 text-xs text-zinc-500">
            One constraint per line (e.g. 1 &lt;= n &lt;= 10^5).
          </p>
          <textarea
            name="constraints"
            rows={4}
            value={formData.constraints}
            onChange={handleChange}
            className={textareaClass}
          />
        </section>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
          <Link to="/admin/problems" className={secondaryButtonClass}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            <CheckCircle2 size={16} />
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProblem;
