import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Code2,
  FileCode2,
  Users,
  Plus,
  ArrowRight,
  ListChecks,
  CheckCircle2,
  Settings,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { getAdminAnalytics } from "../../services/adminApi";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: { total: 0, admins: 0, banned: 0 },
    problems: {
      total: 0,
      byPracticeType: { coding: 0, frontend: 0, backend: 0 },
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
    },
    submissions: {
      total: 0,
      accepted: 0,
      acceptanceRate: "0.0",
      byStatus: {},
      byLanguage: {},
    },
    recentSubmissions: [],
  });

  useEffect(() => {
    let ignore = false;
    getAdminAnalytics()
      .then((res) => {
        if (!ignore && res?.analytics) {
          setData(res.analytics);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard analytics:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const stats = [
    {
      label: "Total Problems",
      value: loading ? "..." : String(data.problems?.total || 0),
      subtitle: `${data.problems?.byPracticeType?.coding || 0} Coding · ${data.problems?.byPracticeType?.frontend || 0} FE · ${data.problems?.byPracticeType?.backend || 0} BE`,
      icon: Code2,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
      link: "/admin/problems",
    },
    {
      label: "Total Submissions",
      value: loading ? "..." : String(data.submissions?.total || 0),
      subtitle: `${data.submissions?.accepted || 0} Accepted`,
      icon: FileCode2,
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
      link: "/admin/submissions",
    },
    {
      label: "Registered Users",
      value: loading ? "..." : String(data.users?.total || 0),
      subtitle: `${data.users?.admins || 0} Admins · ${data.users?.banned || 0} Banned`,
      icon: Users,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      link: "/admin/users",
    },
    {
      label: "Acceptance Rate",
      value: loading ? "..." : `${data.submissions?.acceptanceRate || "0.0"}%`,
      subtitle: "Across all submissions",
      icon: CheckCircle2,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      link: "/admin/analytics",
    },
  ];

  const quickNav = [
    {
      title: "Problem Management",
      description: "Create, edit, review problem statements, starter codes, and test cases.",
      icon: Code2,
      link: "/admin/problems",
      actionText: "View Problems",
      secondaryLink: "/admin/problems/create",
      secondaryText: "+ Create New",
    },
    {
      title: "Submissions Explorer",
      description: "Inspect student submissions, output logs, memory & runtime execution details.",
      icon: FileCode2,
      link: "/admin/submissions",
      actionText: "Browse Submissions",
    },
    {
      title: "User Management",
      description: "Manage accounts, elevate privileges to administrator, and control ban statuses.",
      icon: Users,
      link: "/admin/users",
      actionText: "Manage Users",
    },
    {
      title: "Analytics Suite",
      description: "View submission verdict charts, language trends, and system-wide metrics.",
      icon: BarChart3,
      link: "/admin/analytics",
      actionText: "Open Analytics",
    },
    {
      title: "System & Engine Settings",
      description: "Inspect Node.js environment, database health, and live Piston execution engine status.",
      icon: Settings,
      link: "/admin/settings",
      actionText: "System Diagnostics",
    },
    {
      title: "Security & Privileges",
      description: "Review active administrator accounts and enforce platform execution policies.",
      icon: ShieldCheck,
      link: "/admin/users?role=admin",
      actionText: "Review Admins",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Command Center
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Control center for DevPilot problem management, code execution analytics, user administration, and system health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/problems"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ListChecks size={15} />
            Manage Problems
          </Link>

          <Link
            to="/admin/problems/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
          >
            <Plus size={15} />
            Create Problem
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-200 hover:border-violet-500/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100 group-hover:text-zinc-300 flex items-center gap-1">
                  View <ArrowRight size={12} />
                </span>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-zinc-400">
                {stat.subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Platform Navigation Grid */}
      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Platform Modules & Controls</h2>
          <span className="text-xs text-zinc-500">Direct navigation</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {quickNav.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-white/[0.15] hover:bg-white/[0.035]"
              >
                <div>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{module.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {module.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <Link
                    to={module.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 transition hover:text-violet-300"
                  >
                    {module.actionText} <ArrowRight size={13} />
                  </Link>

                  {module.secondaryLink && (
                    <Link
                      to={module.secondaryLink}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                    >
                      {module.secondaryText}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions Quick Preview */}
      {data.recentSubmissions && data.recentSubmissions.length > 0 && (
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Live Activity Stream</h3>
            </div>
            <Link
              to="/admin/submissions"
              className="text-xs text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
            >
              View all submissions <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06] overflow-x-auto">
            {data.recentSubmissions.slice(0, 5).map((sub) => {
              const isAccepted = sub.status === "accepted";
              return (
                <div key={sub._id} className="flex items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        isAccepted ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <div>
                      <span className="font-medium text-zinc-200">
                        {sub.problem?.title || "Problem"}
                      </span>
                      <span className="ml-2 text-zinc-500">
                        by {sub.user?.name || "User"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      {sub.language}
                    </span>
                    <span
                      className={`font-semibold capitalize ${
                        isAccepted ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {sub.status.replace("_", " ")}
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
