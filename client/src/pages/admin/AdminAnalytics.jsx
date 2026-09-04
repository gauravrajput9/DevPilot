import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Code2,
  FileCode2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { getAdminAnalytics } from "../../services/adminApi";
import { useToast } from "../../components/ui/ToastProvider";
import { PageLoading, PageError } from "../../components/ui/PageState";

const AdminAnalytics = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    getAdminAnalytics()
      .then((res) => {
        if (!ignore && res.success) {
          setData(res.analytics);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load analytics:", err);
          const msg = err.response?.data?.message || err.message || "Failed to load analytics";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey, toast]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setReloadKey((k) => k + 1);
  };

  if (loading) {
    return <PageLoading label="Aggregating platform analytics..." />;
  }

  if (error) {
    return (
      <PageError
        title="Analytics could not be loaded"
        message={error}
        onAction={handleRefresh}
      />
    );
  }

  const { users, problems, submissions, recentSubmissions } = data || {};

  const totalSubmissions = submissions?.total || 0;
  const acceptedSubmissions = submissions?.accepted || 0;
  const acceptanceRate = submissions?.acceptanceRate || 0;

  const verdicts = [
    { key: "accepted", label: "Accepted", count: submissions?.byStatus?.accepted || 0, color: "bg-emerald-500", text: "text-emerald-400" },
    { key: "wrong_answer", label: "Wrong Answer", count: submissions?.byStatus?.wrong_answer || 0, color: "bg-rose-500", text: "text-rose-400" },
    { key: "runtime_error", label: "Runtime Error", count: submissions?.byStatus?.runtime_error || 0, color: "bg-amber-500", text: "text-amber-400" },
    { key: "compile_error", label: "Compile Error", count: submissions?.byStatus?.compile_error || 0, color: "bg-amber-600", text: "text-amber-300" },
    { key: "time_limit", label: "Time Limit", count: submissions?.byStatus?.time_limit || 0, color: "bg-orange-500", text: "text-orange-400" },
  ];

  const languages = [
    { key: "javascript", label: "JavaScript", count: submissions?.byLanguage?.javascript || 0, color: "bg-yellow-500" },
    { key: "python", label: "Python", count: submissions?.byLanguage?.python || 0, color: "bg-blue-500" },
    { key: "cpp", label: "C++", count: submissions?.byLanguage?.cpp || 0, color: "bg-violet-500" },
    { key: "java", label: "Java", count: submissions?.byLanguage?.java || 0, color: "bg-orange-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Performance Metrics
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Platform Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time telemetry on platform growth, problem difficulty balance, and code judging rates.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Learners</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{users?.total ?? 0}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <span>{users?.admins ?? 0} Admins</span>
            <span>·</span>
            <span>{users?.banned ?? 0} Banned</span>
          </div>
        </div>

        {/* Total Problems */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Practice Problems</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <Code2 size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{problems?.total ?? 0}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <span>{problems?.byPracticeType?.coding ?? 0} Coding</span>
            <span>·</span>
            <span>{problems?.byPracticeType?.frontend ?? 0} FE</span>
            <span>·</span>
            <span>{problems?.byPracticeType?.backend ?? 0} BE</span>
          </div>
        </div>

        {/* Submissions */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Submissions</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <FileCode2 size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{totalSubmissions}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 size={12} />
            <span>{acceptedSubmissions} Solutions Accepted</span>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Platform Acceptance</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{acceptanceRate}%</p>
          <p className="mt-2 text-xs text-zinc-500">Global pass rate on judge execution</p>
        </div>
      </div>

      {/* Judging Verdict Distribution & Language Popularity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Judging Verdict Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white">Execution Verdict Breakdown</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Outcomes distribution of code runs across all testcase suites.
            </p>
          </div>

          <div className="space-y-4">
            {verdicts.map((v) => {
              const pct = totalSubmissions > 0 ? ((v.count / totalSubmissions) * 100).toFixed(1) : 0;
              return (
                <div key={v.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${v.text}`}>{v.label}</span>
                    <span className="font-mono text-zinc-400">
                      {v.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className={`h-full ${v.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Popularity */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white">Programming Language Adoption</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Popularity of execution engines chosen by platform learners.
            </p>
          </div>

          <div className="space-y-4">
            {languages.map((lang) => {
              const pct = totalSubmissions > 0 ? ((lang.count / totalSubmissions) * 100).toFixed(1) : 0;
              return (
                <div key={lang.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200">{lang.label}</span>
                    <span className="font-mono text-zinc-400">
                      {lang.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className={`h-full ${lang.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problem Distribution & Difficulties */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Practice Type */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Practice Suite Distribution</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-medium text-zinc-400">Algorithms & Coding</span>
              <p className="mt-2 text-2xl font-bold text-violet-400">
                {problems?.byPracticeType?.coding || 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-medium text-zinc-400">Frontend UI</span>
              <p className="mt-2 text-2xl font-bold text-blue-400">
                {problems?.byPracticeType?.frontend || 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-medium text-zinc-400">Backend API</span>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {problems?.byPracticeType?.backend || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Problem Difficulty Balance</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase">Easy</span>
              <p className="mt-2 text-2xl font-bold text-white">
                {problems?.byDifficulty?.easy || 0}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <span className="text-[11px] font-semibold text-amber-400 uppercase">Medium</span>
              <p className="mt-2 text-2xl font-bold text-white">
                {problems?.byDifficulty?.medium || 0}
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
              <span className="text-[11px] font-semibold text-rose-400 uppercase">Hard</span>
              <p className="mt-2 text-2xl font-bold text-white">
                {problems?.byDifficulty?.hard || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Live Submission Activity Feed</h2>
            <p className="text-xs text-zinc-400">Recent code runs submitted by students across all problems.</p>
          </div>
          <Link
            to="/admin/submissions"
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            View all submissions →
          </Link>
        </div>

        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="divide-y divide-white/[0.05] overflow-x-auto">
            {recentSubmissions.map((sub) => {
              const isAccepted = sub.status === "accepted";
              return (
                <div key={sub._id} className="flex items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/20 text-violet-300 font-semibold text-[11px] shrink-0">
                      {sub.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-white">{sub.user?.name || "User"}</span>
                      <span className="text-zinc-500 mx-1.5">submitted to</span>
                      <span className="font-medium text-zinc-300">{sub.problem?.title || "Problem"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                    <span className="rounded bg-white/[0.05] px-2 py-0.5 text-zinc-300 uppercase">
                      {sub.language}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold capitalize ${
                        isAccepted ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isAccepted ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {sub.status?.replace("_", " ")}
                    </span>
                    <span className="text-zinc-500">
                      {new Date(sub.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-zinc-500">No submissions recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
