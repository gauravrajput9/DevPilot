import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Terminal,
  FileCode2,
  Copy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  getProblem,
  getProblemTestCases,
  createTestCaseApi,
  deleteTestCaseApi,
  updateTestCaseApi,
} from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const AVAILABLE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const emptyTestCase = {
  input: "",
  expectedOutput: "",
  explanation: "",
  allowedLanguages: ["javascript", "python", "cpp"],
  hidden: false,
};

const ManageTestCases = () => {
  const { problemId } = useParams();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formMode, setFormMode] = useState(null); // 'create' | 'edit' | null
  const [editingTestCaseId, setEditingTestCaseId] = useState(null);
  const [formData, setFormData] = useState(emptyTestCase);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const [problemRes, testCasesRes] = await Promise.all([
        getProblem(problemId),
        getProblemTestCases(problemId),
      ]);

      setProblem(problemRes?.problem || null);
      setTestCases(testCasesRes?.testCases || []);
    } catch (error) {
      console.error("Fetch problem and test cases error:", error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to load problem test cases.";

      setLoadError(message);
      toast.error(message, { title: "Unable to load test cases" });
    } finally {
      setLoading(false);
    }
  }, [problemId, toast]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchData());
  }, [fetchData]);

  const handleRetry = () => {
    fetchData();
  };

  const handleStartCreate = () => {
    const supported =
      problem?.codingConfig?.languages ||
      problem?.supportedLanguages ||
      ["javascript", "python", "cpp"];

    setFormData({
      ...emptyTestCase,
      allowedLanguages: supported,
    });
    setEditingTestCaseId(null);
    setFormMode("create");

    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleStartEdit = (testCase) => {
    setEditingTestCaseId(testCase._id);
    setFormData({
      input: testCase.input || "",
      expectedOutput: testCase.expectedOutput || "",
      explanation: testCase.explanation || "",
      allowedLanguages:
        testCase.allowedLanguages?.length > 0
          ? testCase.allowedLanguages
          : ["javascript", "python"],
      hidden: Boolean(testCase.hidden),
    });
    setFormMode("edit");

    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setFormMode(null);
    setEditingTestCaseId(null);
    setFormData(emptyTestCase);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData((prev) => {
      const exists = prev.allowedLanguages.includes(lang);
      const nextLanguages = exists
        ? prev.allowedLanguages.filter((l) => l !== lang)
        : [...prev.allowedLanguages, lang];

      if (nextLanguages.length === 0) {
        toast.warning("At least one language must be allowed.");
        return prev;
      }

      return {
        ...prev,
        allowedLanguages: nextLanguages,
      };
    });
  };

  const handleLoadExample = (example) => {
    if (!example) return;
    setFormData((prev) => ({
      ...prev,
      input: example.input || "",
      expectedOutput: example.output || "",
      explanation: example.explanation || "Loaded from Problem Example",
      hidden: false,
    }));
    toast.info("Populated input and expected output from Problem Example.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.input.trim()) {
      toast.error("Standard input (stdin) is required.", { title: "Missing input" });
      return;
    }

    if (!formData.expectedOutput.trim()) {
      toast.error("Expected standard output (stdout) is required.", {
        title: "Missing expected output",
      });
      return;
    }

    if (formData.allowedLanguages.length === 0) {
      toast.error("Select at least one allowed language.", {
        title: "Missing language",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        input: formData.input.trim(),
        expectedOutput: formData.expectedOutput.trim(),
        explanation: formData.explanation.trim(),
        allowedLanguages: formData.allowedLanguages,
        hidden: Boolean(formData.hidden),
      };

      if (formMode === "create") {
        const res = await createTestCaseApi(problemId, payload);
        toast.success(res.message || "Test case added successfully.", {
          title: "Test case created",
        });
        setTestCases((prev) => [...prev, res.testCase]);
      } else if (formMode === "edit") {
        const res = await updateTestCaseApi(problemId, editingTestCaseId, payload);
        toast.success(res.message || "Test case updated successfully.", {
          title: "Test case updated",
        });
        setTestCases((prev) =>
          prev.map((tc) => (tc._id === editingTestCaseId ? res.testCase : tc))
        );
      }

      handleCancelForm();
    } catch (error) {
      console.error("Save test case error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save test case.",
        { title: "Save failed" }
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testCaseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test case? Submissions will no longer be judged against it."
    );
    if (!confirmed) return;

    try {
      setDeleting(testCaseId);
      const res = await deleteTestCaseApi(problemId, testCaseId);
      setTestCases((prev) => prev.filter((tc) => tc._id !== testCaseId));

      if (editingTestCaseId === testCaseId) {
        handleCancelForm();
      }

      toast.success(res.message || "Test case deleted successfully.", {
        title: "Test case deleted",
      });
    } catch (error) {
      console.error("Delete test case error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete test case.",
        { title: "Delete failed" }
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <PageLoading label="Loading problem test cases..." />;
  }

  if (loadError) {
    return (
      <PageError
        title="Test cases could not be loaded"
        message={loadError}
        onAction={handleRetry}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Top Breadcrumb & Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/admin/problems"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Problems
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInstructions((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <HelpCircle size={14} className="text-violet-400" />
            {showInstructions ? "Hide Guide" : "Show Test Case Guide"}
          </button>

          {!formMode && (
            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
            >
              <Plus size={16} />
              Add Test Case
            </button>
          )}
        </div>
      </div>

      {/* Problem Summary Banner */}
      {problem && (
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="rounded bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-violet-300 border border-violet-500/20">
                  {problem.practiceType || "Coding"}
                </span>
                <span className="text-xs uppercase tracking-wider text-zinc-500">
                  /{problem.slug}
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {problem.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 line-clamp-2">
                {problem.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs text-zinc-300">
              <span className="font-semibold text-white">{testCases.length}</span>
              <span>Test Cases Configured</span>
            </div>
          </div>

          {/* Input/Output Specifications if present */}
          {(problem.codingConfig?.inputFormat || problem.codingConfig?.outputFormat) && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-4 md:grid-cols-2">
              {problem.codingConfig?.inputFormat && (
                <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Input Format
                  </span>
                  <p className="mt-1 text-xs text-zinc-300 font-mono">
                    {problem.codingConfig.inputFormat}
                  </p>
                </div>
              )}

              {problem.codingConfig?.outputFormat && (
                <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Output Format
                  </span>
                  <p className="mt-1 text-xs text-zinc-300 font-mono">
                    {problem.codingConfig.outputFormat}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          INSTRUCTION GUIDE PANEL
      ========================================================= */}
      {showInstructions && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-black/40 to-transparent p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-violet-400" />
              <h2 className="text-base font-semibold text-white">
                How Test Cases Work in DevPilot
              </h2>
            </div>
            <span className="text-xs text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
              Piston Execution Engine
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 text-xs md:grid-cols-3">
            {/* Column 1: Input (stdin) */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-violet-300">
                <Terminal size={15} />
                <span>1. Standard Input (stdin)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Raw text provided to the program's input stream. For multi-line inputs, use line breaks (Enter).
              </p>
              <div className="rounded border border-white/10 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-300">
                <div>5</div>
                <div>10 20 30 40 50</div>
              </div>
              <p className="text-[11px] text-zinc-500">
                Matches <code className="text-violet-300">readline()</code>, <code className="text-violet-300">cin &gt;&gt;</code>, or <code className="text-violet-300">sys.stdin</code>.
              </p>
            </div>

            {/* Column 2: Expected Output (stdout) */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <FileCode2 size={15} />
                <span>2. Expected Output (stdout)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                The exact printed output expected from a correct program.
              </p>
              <div className="rounded border border-white/10 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-300">
                <div>150</div>
              </div>
              <p className="text-[11px] text-zinc-500">
                Trailing whitespace and newline endings (<code className="text-emerald-300">\r\n</code> vs <code className="text-emerald-300">\n</code>) are automatically normalized during judging.
              </p>
            </div>

            {/* Column 3: Public vs Hidden Test Cases */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                <EyeOff size={15} />
                <span>3. Public vs Hidden Cases</span>
              </div>
              <ul className="space-y-1.5 text-zinc-400">
                <li className="flex items-start gap-1.5">
                  <Eye size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span><strong>Public (Hidden: False)</strong>: Visible in the learner's test runner to test and debug their code.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <EyeOff size={13} className="text-violet-400 shrink-0 mt-0.5" />
                  <span><strong>Hidden (Hidden: True)</strong>: Kept secret during practice, evaluated only upon full submission to prevent hardcoded answers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CREATE OR EDIT TEST CASE FORM
      ========================================================= */}
      {formMode && (
        <section className="mb-8 rounded-2xl border border-violet-500/30 bg-white/[0.03] p-6 shadow-xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                {formMode === "create" ? "New Test Case" : "Editing Test Case"}
              </span>
              <h2 className="mt-1 text-xl font-bold text-white">
                {formMode === "create" ? "Add Test Case" : "Update Test Case"}
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Specify raw stdin and expected stdout for evaluating user code.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick load from problem example if available */}
              {problem?.examples && problem.examples.length > 0 && formMode === "create" && (
                <button
                  type="button"
                  onClick={() => handleLoadExample(problem.examples[0])}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 transition hover:bg-violet-500/20"
                >
                  <Copy size={13} />
                  Load Example 1
                </button>
              )}

              <button
                type="button"
                onClick={handleCancelForm}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Input (stdin) */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    Input (Standard Input / stdin)
                  </label>
                  <span className="text-xs text-zinc-500 font-mono">Raw string</span>
                </div>
                <textarea
                  name="input"
                  rows={5}
                  value={formData.input}
                  onChange={handleChange}
                  placeholder="e.g. 2 7 11 15\n9"
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-zinc-200 outline-none transition focus:border-violet-500/50"
                  required
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  This text will be piped directly into the process's standard input.
                </p>
              </div>

              {/* Expected Output (stdout) */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    Expected Output (stdout)
                  </label>
                  <span className="text-xs text-zinc-500 font-mono">Normalized match</span>
                </div>
                <textarea
                  name="expectedOutput"
                  rows={5}
                  value={formData.expectedOutput}
                  onChange={handleChange}
                  placeholder="e.g. 0 1"
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-zinc-200 outline-none transition focus:border-violet-500/50"
                  required
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  A program passes if its trimmed stdout matches this expected text exactly.
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Explanation (Optional)
              </label>
              <input
                type="text"
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                placeholder="e.g. Test with edge case where target is formed by negative numbers."
                className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50"
              />
            </div>

            {/* Allowed Languages & Hidden Switch */}
            <div className="flex flex-col gap-6 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Target Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map(({ value, label }) => {
                    const selected = formData.allowedLanguages.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleLanguageToggle(value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          selected
                            ? "bg-violet-600 text-white"
                            : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hidden Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="hidden"
                    checked={formData.hidden}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-zinc-800 peer-checked:bg-violet-600 peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                </label>
                <div>
                  <span className="text-sm font-medium text-zinc-200">
                    {formData.hidden ? "Hidden Test Case" : "Public Test Case"}
                  </span>
                  <p className="text-xs text-zinc-500">
                    {formData.hidden
                      ? "Evaluated only during final submission"
                      : "Visible in learner problem description"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={handleCancelForm}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01] disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Saving..." : formMode === "create" ? "Add Test Case" : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =========================================================
          TEST CASES LIST
      ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Configured Test Cases ({testCases.length})
          </h2>

          {!formMode && testCases.length > 0 && (
            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500"
            >
              <Plus size={14} />
              Add Another Test Case
            </button>
          )}
        </div>

        {testCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <AlertCircle size={22} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              No test cases created yet
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
              Without test cases, submissions for this problem cannot be evaluated. Add at least one public example case and one hidden submission case.
            </p>
            <button
              type="button"
              onClick={handleStartCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
            >
              <Plus size={16} />
              Create First Test Case
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <div
                key={testCase._id || index}
                className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] transition hover:border-white/[0.12]"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 bg-black/20">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 font-mono text-xs font-bold text-zinc-300">
                      {index + 1}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        testCase.hidden
                          ? "border border-violet-500/30 bg-violet-500/10 text-violet-300"
                          : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {testCase.hidden ? <EyeOff size={11} /> : <Eye size={11} />}
                      {testCase.hidden ? "Hidden Suite" : "Public Example"}
                    </span>

                    {testCase.allowedLanguages && testCase.allowedLanguages.length > 0 && (
                      <div className="hidden gap-1 sm:flex">
                        {testCase.allowedLanguages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded bg-black/40 px-2 py-0.5 text-[10px] uppercase font-mono text-zinc-400"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(testCase)}
                      title="Edit test case"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(testCase._id)}
                      disabled={deleting === testCase._id}
                      title="Delete test case"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-px bg-white/[0.04] md:grid-cols-2">
                  <div className="p-4 bg-zinc-950/40">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Input (stdin)
                    </span>
                    <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-zinc-300">
                      {testCase.input}
                    </pre>
                  </div>

                  <div className="p-4 bg-zinc-950/40">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Expected Output (stdout)
                    </span>
                    <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-emerald-300">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>

                {testCase.explanation && (
                  <div className="border-t border-white/[0.04] px-4 py-2.5 bg-black/10 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-500 mr-2">Explanation:</span>
                    {testCase.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageTestCases;
