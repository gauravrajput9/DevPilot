import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createProblem } from "../../services/problemApi";

const panelClass =
  "rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6";
const labelClass = "mb-2 block text-sm font-medium text-zinc-300";
const inputClass =
  "h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/50 focus:bg-white/[0.05]";
const textareaClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/50 focus:bg-white/[0.05]";
const selectClass =
  "h-11 rounded-lg border border-white/10 bg-[#08090d] px-4 text-sm text-white outline-none transition focus:border-violet-500/50";
const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]";
const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white";
const iconButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300";

const CreateProblem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    practiceType: "coding",
    category: "",
    tags: [],
    difficulty: "easy",
    problemType: "single-file",
    supportedLanguages: ["javascript"],

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

    constraints: [""],
  });

  const [tagInput, setTagInput] = useState("");

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

  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const exists = prev.supportedLanguages.includes(language);

      return {
        ...prev,
        supportedLanguages: exists
          ? prev.supportedLanguages.filter((item) => item !== language)
          : [...prev.supportedLanguages, language],
      };
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
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

      return {
        ...prev,
        examples,
      };
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

      return {
        ...prev,
        constraints,
      };
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

  try {
    console.log("Problem data:", formData);

    const res = await createProblem(formData);

    console.log("Created problem:", res);

    navigate("/admin/problems");
  } catch (error) {
    console.error("Problem creation failed", error);
  }
};

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Link to="/admin/problems" className={secondaryButtonClass}>
          <ArrowLeft size={16} />
          Back to Problems
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Problem builder
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Create Problem
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Create a new problem for the DevPilot practice experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className={panelClass}>
          <h2 className="mb-6 text-xl font-semibold text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Two Sum"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Slug
              </label>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="two-sum"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem..."
              className={`${textareaClass} h-40`}
              required
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>
                Practice Type
              </label>

              <select
                name="practiceType"
                value={formData.practiceType}
                onChange={handleChange}
                className={`${selectClass} w-full`}
              >
                <option value="coding">Coding</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="arrays"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Difficulty
              </label>

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
          </div>

          <div className="mt-6">
            <label className={labelClass}>
              Tags
            </label>

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
                placeholder="array"
                className={`${inputClass} flex-1`}
              />

              <button
                type="button"
                onClick={addTag}
                className={secondaryButtonClass}
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-md border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-violet-300 transition hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={panelClass}>
          <h2 className="mb-6 text-xl font-semibold text-white">
            Problem Configuration
          </h2>

          <div className="mb-6">
            <label className={labelClass}>
              Problem Type
            </label>

            <select
              name="problemType"
              value={formData.problemType}
              onChange={handleChange}
              className={`${selectClass} w-full max-w-md`}
            >
              <option value="single-file">Single File</option>

              <option value="multi-file">Multi File</option>
            </select>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-zinc-300">
              Supported Languages
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                ["javascript", "JavaScript"],
                ["python", "Python"],
                ["cpp", "C++"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
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
        </section>

        <section className={panelClass}>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Starter Code
          </h2>

          <p className="mb-6 text-sm text-zinc-500">
            Provide the initial code shown to users when they open the problem.
          </p>

          <div className="space-y-6">
            {formData.supportedLanguages.includes("javascript") && (
              <div>
                <label className={labelClass}>
                  JavaScript
                </label>

                <textarea
                  value={formData.starterCode.javascript}
                  onChange={(e) =>
                    handleStarterCodeChange("javascript", e.target.value)
                  }
                  placeholder="// Write starter JavaScript code..."
                  className={`${textareaClass} h-48 font-mono`}
                />
              </div>
            )}

            {formData.supportedLanguages.includes("python") && (
              <div>
                <label className={labelClass}>
                  Python
                </label>

                <textarea
                  value={formData.starterCode.python}
                  onChange={(e) =>
                    handleStarterCodeChange("python", e.target.value)
                  }
                  placeholder="# Write starter Python code..."
                  className={`${textareaClass} h-48 font-mono`}
                />
              </div>
            )}

            {formData.supportedLanguages.includes("cpp") && (
              <div>
                <label className={labelClass}>
                  C++
                </label>

                <textarea
                  value={formData.starterCode.cpp}
                  onChange={(e) =>
                    handleStarterCodeChange("cpp", e.target.value)
                  }
                  placeholder="// Write starter C++ code..."
                  className={`${textareaClass} h-48 font-mono`}
                />
              </div>
            )}
          </div>
        </section>

        <section className={panelClass}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Examples</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Examples are visible to users on the problem page.
              </p>
            </div>

            <button
              type="button"
              onClick={addExample}
              className={secondaryButtonClass}
            >
              <Plus size={16} />
              Add Example
            </button>
          </div>

          <div className="space-y-6">
            {formData.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/[0.08] bg-[#08090d]/70 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    Example {index + 1}
                  </h3>

                  {formData.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className={iconButtonClass}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Input
                    </label>

                    <textarea
                      value={example.input}
                      onChange={(e) =>
                        handleExampleChange(index, "input", e.target.value)
                      }
                      placeholder="[2, 7, 11, 15]"
                      className={`${textareaClass} font-mono`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Output
                    </label>

                    <textarea
                      value={example.output}
                      onChange={(e) =>
                        handleExampleChange(index, "output", e.target.value)
                      }
                      placeholder="[0, 1]"
                      className={`${textareaClass} font-mono`}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelClass}>
                    Explanation
                  </label>

                  <textarea
                    value={example.explanation}
                    onChange={(e) =>
                      handleExampleChange(index, "explanation", e.target.value)
                    }
                    placeholder="Explain why this is the expected output..."
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={panelClass}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Constraints
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Define the constraints users should follow.
              </p>
            </div>

            <button
              type="button"
              onClick={addConstraint}
              className={secondaryButtonClass}
            >
              <Plus size={16} />
              Add Constraint
            </button>
          </div>

          <div className="space-y-3">
            {formData.constraints.map((constraint, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) =>
                    handleConstraintChange(index, e.target.value)
                  }
                  placeholder="1 <= nums.length <= 10^4"
                  className={`${inputClass} flex-1 font-mono`}
                />

                {formData.constraints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className={iconButtonClass}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3 pb-10">
          <Link to="/admin/problems" className={secondaryButtonClass}>
            Cancel
          </Link>

          <button type="submit" className={`${primaryButtonClass} px-8`}>
            Create Problem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;
