import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Code2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProblemTestCases } from "../../services/problemApi";

const ManageTestCases = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);

        const response = await getProblemTestCases(problemId);

        setTestCases(response?.testCases || []);
      } catch (error) {
        console.log("Fetch test cases error:", error);
        setTestCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [problemId]);

  const handleEdit = (testCase) => {
    console.log("Edit test case:", testCase);

    // We will open the edit form here
  };

  const handleDelete = (testCase) => {
    console.log("Delete test case:", testCase);

    // We will add delete API here
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
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
            <span className="text-zinc-400">{problemId}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/admin/problems/${problemId}/testcases/manage?create=true`)
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
        >
          <Plus size={18} />
          Add Test Case
        </button>
      </div>

      {/* Test Cases */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {/* Table Header */}
        <div className="border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Test Cases
              </h2>

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

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center text-sm text-zinc-500">
            Loading test cases...
          </div>
        )}

        {/* Empty */}
        {!loading && testCases.length === 0 && (
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
                  `/admin/problems/${problemId}/testcases/manage?create=true`
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus size={16} />
              Add Test Case
            </button>
          </div>
        )}

        {/* List */}
        {!loading && testCases.length > 0 && (
          <div className="divide-y divide-white/[0.06]">
            {testCases.map((testCase, index) => (
              <div
                key={testCase._id || index}
                className="group px-6 py-5 transition hover:bg-white/[0.02]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    {/* Test Case Number + Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-xs font-semibold text-violet-400">
                        {index + 1}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        Test Case {index + 1}
                      </span>

                      {/* Hidden / Visible */}
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

                        <div className="rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3">
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

                        <div className="rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3">
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
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(testCase)}
                      title="Edit test case"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(testCase)}
                      title="Delete test case"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
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