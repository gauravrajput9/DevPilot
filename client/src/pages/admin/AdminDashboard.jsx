import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Code2, FileCode2, Users, Plus, ArrowRight, ListChecks } from "lucide-react";
import { getAdminProblems } from "../../services/problemApi";

const AdminDashboard = () => {
  const [problemStats, setProblemStats] = useState({
    total: 0,
    coding: 0,
    frontend: 0,
    backend: 0,
  });

  useEffect(() => {
    getAdminProblems()
      .then((res) => {
        const problems = res?.problems || [];
        const coding = problems.filter((p) => p.practiceType === "coding").length;
        const frontend = problems.filter((p) => p.practiceType === "frontend").length;
        const backend = problems.filter((p) => p.practiceType === "backend").length;
        setProblemStats({
          total: problems.length,
          coding,
          frontend,
          backend,
        });
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Total Problems",
      value: String(problemStats.total),
      icon: Code2,
    },
    {
      label: "Coding Problems",
      value: String(problemStats.coding),
      icon: BarChart3,
    },
    {
      label: "Frontend Problems",
      value: String(problemStats.frontend),
      icon: FileCode2,
    },
    {
      label: "Backend Problems",
      value: String(problemStats.backend),
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Command Center
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Create and manage DevPilot problems, test cases, and evaluate practice suites.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-violet-500/30 hover:bg-white/[0.04]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                <Icon size={21} />
              </div>

              <p className="text-sm text-zinc-500">{stat.label}</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h3 className="text-base font-semibold text-white">Create New Problem</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Define challenge title, difficulty, practice type, specifications, and starter code templates.
          </p>
          <Link
            to="/admin/problems/create"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            Go to Problem Builder <ArrowRight size={15} />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h3 className="text-base font-semibold text-white">Manage Test Cases</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Access test suites for each problem to configure input/output validation, public examples, and hidden test suites.
          </p>
          <Link
            to="/admin/problems"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            View Problem List <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
