import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, RefreshCw, Pencil, Trash2, AlertCircle, ListChecks } from "lucide-react";

import { deleteProblem, getAdminProblems } from "../../services/problemApi";
import { EmptyState, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const AdminProblems = () => {
  const toast = useToast();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProblems = useCallback(async ({ silent = false } = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminProblems();

      console.log("Admin problems:", res);

      setProblems(res?.problems || []);

      if (!silent) {
        toast.success("Problem list is up to date.", { title: "Refreshed" });
      }
    } catch (error) {
      console.error("Admin Problems page error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load problems";

      setError(message);
      toast.error(message, { title: "Unable to load problems" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProblems({ silent: true }));
  }, [fetchProblems]);

  // Client-side search
  const filteredProblems = useMemo(() => {
    if (!search.trim()) {
      return problems;
    }

    const searchTerm = search.toLowerCase().trim();

    return problems.filter((problem) => {
      return (
        problem.title?.toLowerCase().includes(searchTerm) ||
        problem.slug?.toLowerCase().includes(searchTerm) ||
        problem.category?.toLowerCase().includes(searchTerm) ||
        problem.difficulty?.toLowerCase().includes(searchTerm) ||
        problem.practiceType?.toLowerCase().includes(searchTerm)
      );
    });
  }, [problems, search]);

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";

      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";

      default:
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  const formatType = (value) => {
    if (!value) return "—";

    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDeleteProblems = async (problemId) => {
    const shouldDelete = window.confirm(
      "Delete this problem? This action cannot be undone.",
    );

    if (!shouldDelete) return;

    try {
      await deleteProblem(problemId);

      setProblems((prev) =>
        prev.filter((problem) => problem._id !== problemId),
      );
      toast.success("Problem deleted successfully.", { title: "Deleted" });
    } catch (error) {
      console.log("Delete problem error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete problem.",
        { title: "Delete failed" },
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Content library
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Problems
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Create and manage DevPilot problems.
          </p>
        </div>

        <Link
          to="/admin/problems/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
        >
          <Plus size={18} />
          Create Problem
        </Link>
      </div>

      {/* Search + refresh */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-violet-500/50 focus:bg-white/[0.05]"
          />
        </div>

        <button
          type="button"
          onClick={() => fetchProblems()}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-400" />

          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              Failed to load problems
            </p>

            <p className="mt-1 text-sm text-red-400/70">{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchProblems}
            className="text-sm font-medium text-red-300 transition hover:text-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        {loading ? (
          <PageLoading label="Loading problems..." />
        ) : filteredProblems.length === 0 ? (
          <EmptyState
            title={problems.length === 0 ? "No problems found" : "No matching problems"}
            message={
              problems.length === 0
                ? "Create your first DevPilot problem to see it here."
                : "Try changing your search term."
            }
          >
            {problems.length === 0 && (
              <Link
                to="/admin/problems/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
              >
                <Plus size={16} />
                Create Problem
              </Link>
            )}
          </EmptyState>
        ) : (
          <>
            {/* Result count */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
              <p className="text-xs text-zinc-600">
                Showing{" "}
                <span className="text-zinc-400">{filteredProblems.length}</span>{" "}
                {filteredProblems.length === 1 ? "problem" : "problems"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-white/[0.07] text-xs uppercase tracking-[0.16em] text-zinc-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Title</th>

                    <th className="px-5 py-4 font-semibold">Category</th>

                    <th className="px-5 py-4 font-semibold">Difficulty</th>

                    <th className="px-5 py-4 font-semibold">Type</th>

                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {filteredProblems.map((problem) => (
                    <tr
                      key={problem._id || problem.id || problem.slug}
                      className="transition hover:bg-white/[0.025]"
                    >
                      {/* Title */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-zinc-200">
                            {problem.title}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            /{problem.slug}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-zinc-400">
                          {problem.category || "—"}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getDifficultyClass(
                            problem.difficulty,
                          )}`}
                        >
                          {formatType(problem.difficulty)}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-400">
                            {formatType(problem.problemType)}
                          </span>

                          {problem.practiceType && (
                            <span className="text-xs text-zinc-600">
                              {formatType(problem.practiceType)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/problems/${problem._id}/testcases`)
                            }
                            type="button"
                            title="Manage test cases"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                          >
                            <ListChecks size={15} />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/problems/${problem._id}`)
                            }
                            type="button"
                            title="Edit problem"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleDeleteProblems(problem._id)}
                            type="button"
                            title="Delete problem"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProblems;
