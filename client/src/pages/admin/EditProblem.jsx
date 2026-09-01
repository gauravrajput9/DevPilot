import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { getProblem, updateProblem } from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

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
    difficulty: "easy",
    category: "",
    tags: "",
    constraints: "",
    starterCode: {
      javascript: "",
      python: "",
      cpp: "",
    },
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

      console.log(res);

      const problem = res.problem;

      setFormData({
        title: problem.title || "",
        slug: problem.slug || "",
        description: problem.description || "",
        difficulty: problem.difficulty || "easy",
        category: problem.category || "",
        tags: problem.tags?.join(", ") || "",
        constraints: problem.constraints?.join("\n") || "",

        starterCode: {
          javascript: problem.starterCode?.javascript || "",
          python: problem.starterCode?.python || "",
          cpp: problem.starterCode?.cpp || "",
        },

        examples:
          problem.examples?.length > 0
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
      console.log("Error getting problem:", error);

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
    fetchProblem();
  }, [fetchProblem]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];

    updatedExamples[index] = {
      ...updatedExamples[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      examples: updatedExamples,
    }));
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
        ...formData,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        constraints: formData.constraints
          .split("\n")
          .map((constraint) => constraint.trim())
          .filter(Boolean),
      };

      console.log("Updating:", payload);

      await updateProblem(problemId, payload);

      toast.success("Problem changes saved successfully.", { title: "Saved" });
      navigate("/admin/problems");
    } catch (error) {
      console.log("Update problem error:", error);

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
        <button
          type="button"
          onClick={() => navigate("/admin/problems")}
          className="mb-5 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to problems
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Problem editor
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Edit Problem
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Problem ID: {problemId}
            </p>
          </div>

          {/* Manage Test Cases */}
          <button
            type="button"
            onClick={() => navigate(`/admin/problems/${problemId}/testcases`)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-400 transition hover:border-violet-500/40 hover:bg-violet-500/20 hover:text-violet-300"
          >
            <Plus size={16} />
            Manage Test Cases
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the main problem details.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Three Sum"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Slug
              </label>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="three-sum"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-500/50"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="maths"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Write the problem description..."
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
            />
          </div>

          {/* Tags */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="array, maths, algorithms"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
            />

            <p className="mt-2 text-xs text-zinc-600">
              Separate tags using commas.
            </p>
          </div>
        </section>

        {/* Constraints */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h2 className="text-lg font-semibold text-white">Constraints</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Enter one constraint per line.
          </p>

          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            rows={5}
            placeholder={`1 <= num1 <= 1000\n1 <= num2 <= 1000\n1 <= num3 <= 1000`}
            className="mt-5 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
          />
        </section>

        {/* Starter Code */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Starter Code</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Starter templates shown inside the code editor.
            </p>
          </div>

          <div className="space-y-5">
            {/* JS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                JavaScript
              </label>

              <textarea
                value={formData.starterCode.javascript}
                onChange={(e) =>
                  handleStarterCodeChange("javascript", e.target.value)
                }
                rows={7}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-300 outline-none transition focus:border-violet-500/50"
              />
            </div>

            {/* Python */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Python
              </label>

              <textarea
                value={formData.starterCode.python}
                onChange={(e) =>
                  handleStarterCodeChange("python", e.target.value)
                }
                rows={7}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-300 outline-none transition focus:border-violet-500/50"
              />
            </div>

            {/* CPP */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                C++
              </label>

              <textarea
                value={formData.starterCode.cpp}
                onChange={(e) => handleStarterCodeChange("cpp", e.target.value)}
                rows={7}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-300 outline-none transition focus:border-violet-500/50"
              />
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Examples</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Examples visible to users on the problem page.
              </p>
            </div>

            <button
              type="button"
              onClick={addExample}
              className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-400 transition hover:bg-violet-500/20"
            >
              <Plus size={16} />
              Add Example
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {formData.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/[0.07] bg-black/20 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-300">
                    Example {index + 1}
                  </h3>

                  {formData.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Input
                    </label>

                    <textarea
                      value={example.input || ""}
                      onChange={(e) =>
                        handleExampleChange(index, "input", e.target.value)
                      }
                      rows={4}
                      className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-zinc-300 outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Output
                    </label>

                    <textarea
                      value={example.output || ""}
                      onChange={(e) =>
                        handleExampleChange(index, "output", e.target.value)
                      }
                      rows={4}
                      className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-zinc-300 outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Explanation
                  </label>

                  <textarea
                    value={example.explanation || ""}
                    onChange={(e) =>
                      handleExampleChange(index, "explanation", e.target.value)
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-zinc-300 outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-3 pb-10">
          {saveError && (
            <p className="mr-auto rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {saveError}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/admin/problems")}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProblem;
