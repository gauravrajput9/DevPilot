import {
  ArrowRight,
  Code2,
  Database,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";

const practiceOptions = [
  {
    title: "Coding Practice",
    description:
      "Strengthen your problem-solving skills with algorithms, data structures, and programming challenges.",
    topics: [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Stacks",
      "Trees",
      "Graphs",
    ],
    icon: Code2,
    path: "/problems/coding",
  },
  {
    title: "Frontend Development",
    description:
      "Build real-world interfaces and applications using React, JSX, and modern frontend concepts.",
    topics: [
      "React",
      "JSX",
      "Components",
      "State",
      "APIs",
      "UI",
    ],
    icon: Layers3,
    path: "/problems/frontend",
  },
  {
    title: "Backend Development",
    description:
      "Practice building APIs, backend systems, authentication, databases, and server-side applications.",
    topics: [
      "REST APIs",
      "Node.js",
      "Express",
      "MongoDB",
      "Authentication",
      "CRUD",
    ],
    icon: Database,
    path: "/problems/backend",
  },
];

const PracticeAreaSelection = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-16">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <Code2
              size={22}
              className="text-slate-300"
            />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Practice with Dev
            <span className="text-slate-400">
              Pilot
            </span>
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Choose a practice area and work on problems
            designed to improve your development skills.
          </p>
        </div>

        {/* Practice Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {practiceOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.title}
                to={option.path}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl transition group-hover:bg-white/[0.05]" />

                {/* Icon */}
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                  <Icon size={21} />
                </div>

                {/* Content */}
                <h2 className="text-lg font-semibold text-white">
                  {option.title}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                  {option.description}
                </p>

                {/* Topics */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {option.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-500"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Bottom */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
                  <span className="text-xs font-medium text-slate-400">
                    Explore problems
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-white"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom information */}
        <div className="mt-10 rounded-2xl border border-slate-800/80 bg-slate-900/20 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Start wherever you want
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Switch between coding challenges and
                real-world development tasks.
              </p>
            </div>

            <span className="text-xs text-slate-700">
              DevPilot Problems
            </span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PracticeAreaSelection;
