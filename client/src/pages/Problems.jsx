import {
  ArrowRight,
  Braces,
  Code2,
  Database,
  Globe,
  Server,
} from "lucide-react";

const problems = [
  {
    icon: Globe,
    title: "HTML & CSS",
    description: "Build responsive layouts and master modern UI techniques.",
    problems: 24,
  },
  {
    icon: Braces,
    title: "JavaScript",
    description: "Strengthen your JavaScript fundamentals through practical problems.",
    problems: 42,
  },
  {
    icon: Code2,
    title: "React",
    description: "Practice components, hooks, state management, and real-world patterns.",
    problems: 36,
  },
  {
    icon: Server,
    title: "Node.js",
    description: "Solve backend problems involving APIs, Express, and server-side logic.",
    problems: 28,
  },
  {
    icon: Database,
    title: "Databases",
    description: "Practice MongoDB, queries, data modeling, and database concepts.",
    problems: 21,
  },
];

const Problems = () => {
  return (
    <section id="problems" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Practice & improve
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Solve problems.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Build skills.
              </span>
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-500">
              Put your knowledge into practice with carefully designed
              problems covering the technologies you use to build modern
              applications.
            </p>
          </div>

          <button className="group flex w-fit items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300">
            View all problems
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Problem Categories */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <div
                key={problem.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04]"
              >
                {/* Background glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl transition group-hover:bg-violet-600/20" />

                <div className="relative">
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-violet-400 transition group-hover:border-violet-500/20 group-hover:bg-violet-500/10">
                    <Icon size={21} />
                  </div>

                  {/* Content */}
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {problem.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-xs text-zinc-600">
                      {problem.problems} problems
                    </span>

                    <button className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition group-hover:text-violet-400">
                      Explore
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problems;