
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Code2,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getProblemTestCases,
  createTestCaseApi,
  updateTestCase,
  deleteTestCase,
} from "../../services/problemApi";

import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const emptyTestCase = {
  input: "",
  expectedOutput: "",
  explanation: "",
  allowedLanguages: ["javascript"],
  hidden: true,
};

const CreateTestCase  = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [testCases, setTestCases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // null = list mode
  // "create" = create form
  // "edit" = edit form
  const [formMode, setFormMode] = useState(null);

  const [editingTestCaseId, setEditingTestCaseId] = useState(null);

  const [formData, setFormData] = useState(emptyTestCase);

  // --------------------------------------------------
  // Fetch Test Cases
  // --------------------------------------------------

  const fetchTestCases = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getProblemTestCases(problemId);

      setTestCases(res.testCases || []);
    } catch (error) {
      console.log("Get test cases error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load test cases.";

      setLoadError(message);

      toast.error(message, {
        title: "Unable to load test cases",
      });
    } finally {
      setLoading(false);
    }
  }, [problemId, toast]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  // --------------------------------------------------
  // Open Create Form
  // --------------------------------------------------

  const handleCreateClick = () => {
    setFormData(emptyTestCase);
    setEditingTestCaseId(null);
    setFormMode("create");
  };

  // --------------------------------------------------
  // Open Edit Form
  // --------------------------------------------------

  const handleEditClick = (testCase) => {
    setFormData({
      input: testCase.input || "",
      expectedOutput: testCase.expectedOutput || "",
      explanation: testCase.explanation || "",
      allowedLanguages:
        testCase.allowedLanguages?.length > 0
          ? testCase.allowedLanguages
          : ["javascript"],
      hidden:
        testCase.hidden !== undefined
          ? testCase.hidden
          : true,
    });

    setEditingTestCaseId(testCase._id);
    setFormMode("edit");
  };

  // --------------------------------------------------
  // Close Form
  // --------------------------------------------------

  const handleCancel = () => {
    setFormMode(null);
    setEditingTestCaseId(null);
    setFormData(emptyTestCase);
  };

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Language Selection
  // --------------------------------------------------

  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const exists = prev.allowedLanguages.includes(language);

      return {
        ...prev,
        allowedLanguages: exists
          ? prev.allowedLanguages.filter((item) => item !== language)
          : [...prev.allowedLanguages, language],
      };
    });
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.input.trim()) {
      toast.error("Input is required.");
      return;
    }

    if (!formData.expectedOutput.trim()) {
      toast.error("Expected output is required.");
      return;
    }

    if (formData.allowedLanguages.length === 0) {
      toast.error("Select at least one language.");
      return;
    }

    try {
      setSaving(true);

      if (formMode === "create") {
        const res = await createTestCaseApi(problemId, formData);

        toast.success(
          res.message || "Test case created successfully.",
          {
            title: "Test case created",
          }
        );

        navigate(`/admin/problems/${problemId}/testcases`)
      }

      if (formMode === "edit") {
        const res = await updateTestCase(
          problemId,
          editingTestCaseId,
          formData
        );

        toast.success(
          res.message || "Test case updated successfully.",
          {
            title: "Test case updated",
          }
        );
      }

      await fetchTestCases();

      handleCancel();
    } catch (error) {
      console.log("Save test case error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save test case.";

      toast.error(message, {
        title: "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (testCaseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test case?"
    );

    if (!confirmed) return;

    try {
      setDeleting(testCaseId);

      const res = await deleteTestCase(
        problemId,
        testCaseId
      );

      setTestCases((prev) =>
        prev.filter((testCase) => testCase._id !== testCaseId)
      );

      toast.success(
        res.message || "Test case deleted successfully.",
        {
          title: "Test case deleted",
        }
      );
    } catch (error) {
      console.log("Delete test case error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete test case.";

      toast.error(message, {
        title: "Delete failed",
      });
    } finally {
      setDeleting(null);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return <PageLoading label="Loading test cases..." />;
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (loadError) {
    return (
      <PageError
        title="Test cases could not be loaded"
        message={loadError}
        onAction={fetchTestCases}
      />
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/problems/${problemId}/edit`)
          }
          className="mb-5 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to problem
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Problem management
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Test Cases
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Create, edit and manage test cases for this problem.
            </p>
          </div>

          {!formMode && (
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus size={17} />
              Add Test Case
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* CREATE / EDIT FORM */}
      {/* ------------------------------------------------ */}

      {formMode && (
        <section className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {formMode === "create"
                  ? "Create Test Case"
                  : "Edit Test Case"}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {formMode === "create"
                  ? "Add a new test case for this problem."
                  : "Update the selected test case."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="2 3 4"
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Provide the exact input that will be passed to the program.
              </p>
            </div>

            {/* Expected Output */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Expected Output
              </label>

              <textarea
                name="expectedOutput"
                value={formData.expectedOutput}
                onChange={handleChange}
                rows={5}
                placeholder="9"
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />

              <p className="mt-2 text-xs text-zinc-600">
                The output produced by a correct solution.
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
                className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>

            {/* Languages */}

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Allowed Languages
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    value: "javascript",
                    label: "JavaScript",
                  },
                  {
                    value: "python",
                    label: "Python",
                  },
                  {
                    value: "cpp",
                    label: "C++",
                  },
                ].map((language) => {
                  const selected =
                    formData.allowedLanguages.includes(
                      language.value
                    );

                  return (
                    <button
                      key={language.value}
                      type="button"
                      onClick={() =>
                        handleLanguageChange(language.value)
                      }
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                          : "border-white/10 bg-black/20 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                      }`}
                    >
                      {language.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hidden */}

            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {formData.hidden ? (
                    <EyeOff
                      size={18}
                      className="mt-0.5 text-violet-400"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="mt-0.5 text-zinc-500"
                    />
                  )}

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Hidden Test Case
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Hidden test cases are not shown to users.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      hidden: !prev.hidden,
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    formData.hidden
                      ? "bg-violet-600"
                      : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      formData.hidden
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Form Actions */}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : formMode === "create"
                    ? "Create Test Case"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ------------------------------------------------ */}
      {/* TEST CASE LIST */}
      {/* ------------------------------------------------ */}

      {!formMode && (
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Test Cases
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {testCases.length}{" "}
                {testCases.length === 1
                  ? "test case"
                  : "test cases"}
              </p>
            </div>

            <Code2
              size={20}
              className="text-zinc-600"
            />
          </div>

          {testCases.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20">
                <Code2
                  size={20}
                  className="text-zinc-600"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                No test cases yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
                Create the first test case for this problem.
              </p>

              <button
                type="button"
                onClick={handleCreateClick}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus size={16} />
                Add Test Case
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {testCases.map((testCase, index) => (
                <div
                  key={testCase._id}
                  className="p-6 transition hover:bg-white/[0.015]"
                >
                  {/* Test Case Header */}

                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-semibold text-violet-400">
                        {index + 1}
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200">
                          Test Case {index + 1}
                        </h3>

                        <div className="mt-1 flex items-center gap-2">
                          {testCase.hidden ? (
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                              <EyeOff size={12} />
                              Hidden
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Eye size={12} />
                              Visible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(testCase)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
                        title="Edit test case"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(testCase._id)
                        }
                        disabled={
                          deleting === testCase._id
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete test case"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Input / Output */}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
                        Input
                      </p>

                      <pre className="min-h-[90px] overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-4 font-mono text-sm text-zinc-400">
                        {testCase.input || "—"}
                      </pre>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
                        Expected Output
                      </p>

                      <pre className="min-h-[90px] overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-4 font-mono text-sm text-zinc-400">
                        {testCase.expectedOutput || "—"}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}

                  {testCase.explanation && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
                        Explanation
                      </p>

                      <p className="rounded-lg border border-white/[0.06] bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-500">
                        {testCase.explanation}
                      </p>
                    </div>
                  )}

                  {/* Languages */}

                  {testCase.allowedLanguages?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {testCase.allowedLanguages.map(
                        (language) => (
                          <span
                            key={language}
                            className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-xs text-zinc-500"
                          >
                            {language}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default CreateTestCase;