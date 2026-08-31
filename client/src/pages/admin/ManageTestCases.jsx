import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

const ManageTestCases = () => {
  const { problemId } = useParams();

  return (
    <div className="mx-auto max-w-6xl">
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
            Manage test cases for problem {problemId}.
          </p>
        </div>

        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]">
          <Plus size={18} />
          Add Test Case
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
        <div className="p-10 text-center text-sm text-zinc-600">
          No test cases found.
        </div>
      </div>
    </div>
  );
};

export default ManageTestCases;
