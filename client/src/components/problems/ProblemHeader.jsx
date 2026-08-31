import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProblemHeader = ({ problem, solved = false }) => {
  const difficultyStyles = {
    easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-5">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to={`/problems/${problem.practiceType}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-900 hover:text-white"
          title="Back to problems"
        >
          <ArrowLeft size={17} />
        </Link>

        <div className="h-5 w-px bg-slate-800" />

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-sm font-semibold text-white">
              {problem.title}
            </h1>

            {solved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Solved</span>
              </div>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize ${
                difficultyStyles[problem.difficulty] ||
                "border-slate-800 bg-slate-900 text-slate-400"
              }`}
            >
              {problem.difficulty}
            </span>

            <span className="text-[11px] text-slate-600">
              {problem.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="hidden items-center gap-4 sm:flex">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock3 size={13} />
          <span>Practice</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <CircleDot size={13} />
          <span>{problem.practiceType}</span>
        </div>
      </div>
    </header>
  );
};

export default ProblemHeader;