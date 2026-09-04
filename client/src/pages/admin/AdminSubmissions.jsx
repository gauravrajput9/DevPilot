import { useEffect, useState } from "react";
import {
  FileCode2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Eye,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAdminSubmissions, getAdminSubmissionDetails } from "../../services/adminApi";
import { useToast } from "../../components/ui/ToastProvider";
import { PageLoading, PageError } from "../../components/ui/PageState";

const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  wrong_answer: {
    label: "Wrong Answer",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    icon: XCircle,
  },
  runtime_error: {
    label: "Runtime Error",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  compile_error: {
    label: "Compile Error",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  time_limit: {
    label: "Time Limit",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    icon: Clock,
  },
  pending: {
    label: "Pending",
    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
    icon: Clock,
  },
};

const AdminSubmissions = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Detail Modal
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    let ignore = false;
    const params = {
      page: currentPage,
      limit: 20,
      status: selectedStatus,
      language: selectedLanguage,
      search: searchTerm,
    };

    getAdminSubmissions(params)
      .then((res) => {
        if (!ignore && res.success) {
          setSubmissions(res.submissions || []);
          setPagination(res.pagination || { total: 0, page: currentPage, limit: 20, totalPages: 1 });
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load submissions:", err);
          const msg = err.response?.data?.message || err.message || "Failed to load submissions";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentPage, selectedStatus, selectedLanguage, searchTerm, reloadKey, toast]);

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
  };

  const handleStatusChange = (val) => {
    setLoading(true);
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleLanguageChange = (val) => {
    setLoading(true);
    setSelectedLanguage(val);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setLoading(true);
    setCurrentPage(1);
    setReloadKey((k) => k + 1);
  };

  const handleOpenDetail = async (id) => {
    setSelectedSubmissionId(id);
    setDetailLoading(true);
    try {
      const res = await getAdminSubmissionDetails(id);
      if (res.success) {
        setDetailData(res.submission);
      }
    } catch (err) {
      console.error("Failed to load submission details:", err);
      toast.error("Could not load submission details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedSubmissionId(null);
    setDetailData(null);
    setCopiedCode(false);
  };

  const handleCopyCode = () => {
    if (detailData?.sourceCode) {
      navigator.clipboard.writeText(detailData.sourceCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatDifficulty = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "medium":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "hard":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Platform Activity
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Submissions Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Monitor and review code submitted across all problems by platform learners.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Search by problem title or user name..."
            className="h-10 w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500/50 outline-none"
          />
        </div>

        {/* Verdict Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Verdict:</span>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#08090d] px-3 text-xs text-white outline-none focus:border-violet-500/50"
          >
            <option value="all">All Verdicts</option>
            <option value="accepted">Accepted</option>
            <option value="wrong_answer">Wrong Answer</option>
            <option value="runtime_error">Runtime Error</option>
            <option value="compile_error">Compile Error</option>
            <option value="time_limit">Time Limit</option>
          </select>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#08090d] px-3 text-xs text-white outline-none focus:border-violet-500/50"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Submissions Content */}
      {loading ? (
        <PageLoading label="Loading submissions..." />
      ) : error ? (
        <PageError title="Failed to load submissions" message={error} onAction={handleRefresh} />
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-500">
            <FileCode2 size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">No submissions found</h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500">
            No submissions matched your search criteria or no code has been submitted yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Problem</th>
                  <th className="px-5 py-4">Language</th>
                  <th className="px-5 py-4">Verdict</th>
                  <th className="px-5 py-4">Tests Passed</th>
                  <th className="px-5 py-4">Runtime / Memory</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {submissions.map((sub) => {
                  const statusInfo = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={sub.id} className="transition hover:bg-white/[0.02]">
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {sub.user?.image ? (
                            <img
                              src={sub.user.image}
                              alt={sub.user.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/20 text-violet-300 font-semibold text-[11px]">
                              {sub.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">{sub.user?.name}</p>
                            {sub.user?.email && (
                              <p className="truncate text-[11px] text-zinc-500">{sub.user.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Problem */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200">
                            {sub.problem?.title || "Unknown Problem"}
                          </span>
                          {sub.problem?.difficulty && (
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${formatDifficulty(
                                sub.problem.difficulty
                              )}`}
                            >
                              {sub.problem.difficulty}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Language */}
                      <td className="px-5 py-4">
                        <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] font-medium text-violet-300 uppercase">
                          {sub.language === "cpp" ? "C++" : sub.language}
                        </span>
                      </td>

                      {/* Verdict */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Tests Passed */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-zinc-300">
                          {sub.passedTestCases} / {sub.totalTestCases}
                        </span>
                      </td>

                      {/* Runtime / Memory */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5 font-mono text-[11px] text-zinc-400">
                          <p>{sub.runtime ? `${sub.runtime} ms` : "-"}</p>
                          <p className="text-[10px] text-zinc-500">
                            {sub.memory ? `${(sub.memory / 1024).toFixed(1)} KB` : "-"}
                          </p>
                        </div>
                      </td>

                      {/* Submitted At */}
                      <td className="px-5 py-4 text-zinc-400">
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(sub.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:bg-violet-600/20 hover:text-violet-300 hover:border-violet-500/30"
                        >
                          <Eye size={13} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 text-xs text-zinc-400">
            <span>
              Showing {submissions.length} of {pagination.total} submissions
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-medium text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmissionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-white/15 bg-[#08090f] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-white">Submission Review</h3>
                <p className="text-xs text-zinc-400">
                  ID: <span className="font-mono text-zinc-500">{selectedSubmissionId}</span>
                </p>
              </div>

              <button
                onClick={handleCloseDetail}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading ? (
                <PageLoading label="Retrieving submission source & logs..." />
              ) : !detailData ? (
                <p className="text-center text-sm text-zinc-500">Failed to load submission data.</p>
              ) : (
                <>
                  {/* Meta summary cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-[11px] text-zinc-500">Verdict</span>
                      <p className="mt-1 font-semibold capitalize text-white">
                        {detailData.status?.replace("_", " ")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-[11px] text-zinc-500">Language</span>
                      <p className="mt-1 font-mono font-semibold uppercase text-violet-300">
                        {detailData.language}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-[11px] text-zinc-500">Tests Passed</span>
                      <p className="mt-1 font-mono font-semibold text-emerald-400">
                        {detailData.passedTestCases} / {detailData.totalTestCases}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-[11px] text-zinc-500">Runtime</span>
                      <p className="mt-1 font-mono font-semibold text-white">
                        {detailData.runtime ? `${detailData.runtime} ms` : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Problem & User info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                    <div>
                      <span className="text-zinc-500">Problem:</span>
                      <p className="font-semibold text-white mt-0.5">
                        {detailData.problemId?.title || "Problem Statement"}
                      </p>
                    </div>

                    <div>
                      <span className="text-zinc-500">Learner:</span>
                      <p className="font-semibold text-white mt-0.5">
                        {detailData.user?.name || "Unknown User"} ({detailData.user?.email || "No email"})
                      </p>
                    </div>
                  </div>

                  {/* Source Code */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">Submitted Code</span>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                      >
                        {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedCode ? "Copied" : "Copy Code"}
                      </button>
                    </div>

                    <pre className="max-h-72 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200">
                      {detailData.sourceCode || "// No code saved"}
                    </pre>
                  </div>

                  {/* Error traces / logs if any */}
                  {detailData.errorMessage && (
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-rose-400">
                        Error Trace / Compiler Diagnostic
                      </span>
                      <pre className="max-h-40 overflow-x-auto rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 font-mono text-xs text-rose-300">
                        {detailData.errorMessage}
                      </pre>
                    </div>
                  )}

                  {/* Standard output if present */}
                  {detailData.stdout && (
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-zinc-400">
                        Execution Standard Output
                      </span>
                      <pre className="max-h-40 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs text-zinc-300">
                        {detailData.stdout}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-white/10 px-6 py-3">
              <button
                onClick={handleCloseDetail}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
