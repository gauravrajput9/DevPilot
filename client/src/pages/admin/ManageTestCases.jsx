import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Code2,
  X,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  getProblemTestCases,
  deleteTestCaseApi,
  updateTestCaseApi,
} from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const emptyTestCase = {
  input: "",
  expectedOutput: "",
  explanation: "",
  allowedLanguages: ["javascript"],
  hidden: false,
};

const ManageTestCases = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editingTestCase, setEditingTestCase] = useState(null);
  const [formData, setFormData] = useState(emptyTestCase);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchTestCases = useCallback(async () => {
    try {
      const response = await getProblemTestCases(problemId);

      setLoadError("");
      setTestCases(response?.testCases || []);
    } catch (error) {
      console.log("Fetch test cases error:", error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to load test cases.";

      setLoadError(message);
      setTestCases([]);
      toast.error(message, { title: "Unable to load test cases" });
    } finally {
      setLoading(false);
    }
  }, [problemId, toast]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchTestCases());
  }, [fetchTestCases]);

  const handleRetry = () => {
    setLoading(true);
    setLoadError("");
    fetchTestCases();
  };

  const handleEdit = (testCase) => {
    setEditingTestCase(testCase);

    setFormData({
      input: testCase.input || "",
      expectedOutput: testCase.expectedOutput || "",
      explanation: testCase.explanation || "",
      allowedLanguages:
        testCase.allowedLanguages?.length > 0
          ? testCase.allowedLanguages
          : ["javascript"],
      hidden: testCase.hidden ?? false,
    });

    // Scroll to top so the edit form is visible
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const alreadySelected = prev.allowedLanguages.includes(language);

      return {
        ...prev,
        allowedLanguages: alreadySelected
          ? prev.allowedLanguages.filter((item) => item !== language)
          : [...prev.allowedLanguages, language],
      };
    });
  };

  const handleCancelEdit = () => {
    setEditingTestCase(null);
    setFormData(emptyTestCase);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingTestCase?._id) {
      return;
    }

    if (!formData.input.trim()) {
      toast.error("Input is required.", { title: "Missing input" });
      return;
    }

    if (!formData.expectedOutput.trim()) {
      toast.error("Expected output is required.", {
        title: "Missing expected output",
      });
      return;
    }

    if (formData.allowedLanguages.length === 0) {
      toast.error("Select at least one language.", {
        title: "Missing language",
      });
      return;
    }

    try {
      setSaving(true);

      const response = await updateTestCaseApi(problemId, editingTestCase._id, {
        input: formData.input,
        expectedOutput: formData.expectedOutput,
        explanation: formData.explanation,
        allowedLanguages: formData.allowedLanguages,
        hidden: formData.hidden,
      });

      // Update test case in local state
      setTestCases((prev) =>
        prev.map((testCase) =>
          testCase._id === editingTestCase._id ? response.testCase : testCase,
        ),
      );

      toast.success(
        response.message || "Test case updated successfully.",
        { title: "Test case updated" },
      );

      handleCancelEdit();
    } catch (error) {
      console.log("Update test case error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update test case.",
        { title: "Update failed" },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testCase) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test case?",
    );

    if (!confirmed) return;

    try {
      setDeleting(testCase._id);

      const response = await deleteTestCaseApi(problemId, testCase._id);

      setTestCases((prev) =>
        prev.filter((item) => item._id !== testCase._id),
      );

      if (editingTestCase?._id === testCase._id) {
        handleCancelEdit();
      }

      toast.success(
        response.message || "Test case deleted successfully.",
        { title: "Test case deleted" },
      );
    } catch (error) {
      console.log("Delete test case error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete test case.",
        { title: "Delete failed" },
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <PageLoading label="Loading test cases..." />;
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/admin/problems"
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Problems
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Quality checks
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Test Cases
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Manage test cases for problem{" "}
            <span className="text-zinc-400">{problemId}</span>
          </p>
        </div>

        {/* Add Test Case */}
        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/problems/${problemId}/testcases/manage?create=true`,
            )
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
        >
          <Plus size={18} />
          Add Test Case
        </button>
      </div>

      {/* ================================================= */}
      {/* EDIT FORM */}
      {/* ================================================= */}

      {editingTestCase && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.025] shadow-xl shadow-violet-950/10">
          {/* Form Header */}

          <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Test Case
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Edit Test Case
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Update the input, expected output, or execution settings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          {/* Form */}

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            {/* Input */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Input
              </label>

              <textarea
                name="input"
                value={formData.input}
                onChange={handleChange}
                rows={5}
                placeholder="Enter test case input..."
                className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
              />

              <p className="mt-2 text-xs text-zinc-600">
                The exact input that will be passed to the submitted program.
              </p>
            </div>

            {/* Explanation */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Explanation
                <span className="ml-2 text-xs font-normal text-zinc-600">
                  Optional
                </span>
              </label>

              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                placeholder="Optional explanation for this test case..."
                className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Expected Output
              </label>

              <textarea
                name="expectedOutput"
                value={formData.expectedOutput}
                onChange={handleChange}
                rows={5}
                placeholder="Enter expected output..."
                className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
              />

              <p className="mt-2 text-xs text-zinc-600">
                The output produced by the solution must match this value.
              </p>
            </div>

            {/* Allowed Languages */}

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Allowed Languages
              </label>

              <div className="flex flex-wrap gap-3">
                {["javascript", "python", "cpp"].map((language) => {
                  const selected = formData.allowedLanguages.includes(language);

                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageChange(language)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-violet-500/40 bg-violet-500/10 text-violet-400"
                          : "border-white/10 bg-white/[0.03] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                      }`}
                    >
                      {language}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                Select the languages for which this test case should run.
              </p>
            </div>

            {/* Hidden */}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
              <input
                type="checkbox"
                name="hidden"
                checked={formData.hidden}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/20 text-violet-600 focus:ring-violet-500"
              />

              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Hidden test case
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Hidden test cases are not shown to users but are used when
                  judging submissions.
                </p>
              </div>
            </label>

            {/* Actions */}

            <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================= */}
      {/* TEST CASES CONTAINER */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {/* List Header */}

        <div className="border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Test Cases</h2>

              <p className="mt-1 text-xs text-zinc-500">
                {testCases.length}{" "}
                {testCases.length === 1 ? "test case" : "test cases"} configured
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400">
              {testCases.length} Total
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {testCases.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <Code2 size={22} className="text-zinc-500" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No test cases found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Add test cases to validate user submissions for this problem.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/problems/${problemId}/testcases/manage?create=true`,
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus size={16} />
              Add Test Case
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* LIST */}
        {/* ================================================= */}

        {testCases.length > 0 && (
          <div className="divide-y divide-white/[0.06]">
            {testCases.map((testCase, index) => (
              <div
                key={testCase._id || index}
                className="group px-6 py-5 transition hover:bg-white/[0.02]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Test Case Content */}

                  <div className="min-w-0 flex-1">
                    {/* Header */}

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-xs font-semibold text-violet-400">
                        {index + 1}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        Test Case {index + 1}
                      </span>

                      {/* Visibility */}

                      {testCase.hidden ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-400">
                          <EyeOff size={12} />
                          Hidden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                          <Eye size={12} />
                          Visible
                        </span>
                      )}
                    </div>

                    {/* Input / Output */}

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {/* Input */}

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Input
                        </p>

                        <div className="min-h-[48px] rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3">
                          <code className="break-all text-sm text-zinc-300">
                            {testCase.input || "—"}
                          </code>
                        </div>
                      </div>

                      {/* Expected Output */}

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Expected Output
                        </p>

                        <div className="min-h-[48px] rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3">
                          <code className="break-all text-sm text-emerald-400">
                            {testCase.expectedOutput || "—"}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-zinc-600">
                        Allowed languages:
                      </span>

                      {testCase.allowedLanguages?.map((language) => (
                        <span
                          key={language}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-zinc-400"
                        >
                          {language}
                        </span>
                      ))}
                    </div>

                    {testCase.explanation && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Explanation
                        </p>

                        <p className="rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-400">
                          {testCase.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ================================================= */}
                  {/* ACTIONS */}
                  {/* ================================================= */}

                  <div className="flex shrink-0 items-center gap-2">
                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() => handleEdit(testCase)}
                      title="Edit test case"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() => handleDelete(testCase)}
                      disabled={deleting === testCase._id}
                      title="Delete test case"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestCases;
