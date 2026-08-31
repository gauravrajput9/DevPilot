import { BarChart3, Code2, FileCode2, Users } from "lucide-react";

const stats = [
  {
    label: "Total Problems",
    value: "0",
    icon: Code2,
  },
  {
    label: "Coding Problems",
    value: "0",
    icon: BarChart3,
  },
  {
    label: "Users",
    value: "0",
    icon: Users,
  },
  {
    label: "Submissions",
    value: "0",
    icon: FileCode2,
  },
];

const AdminDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Command center
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Manage DevPilot problems, test cases, users and submissions.
        </p>
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

      <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
        <p className="text-sm font-semibold text-white">Admin workflow</p>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Create a problem first, then manage its test cases from the problem
          detail workflow.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
