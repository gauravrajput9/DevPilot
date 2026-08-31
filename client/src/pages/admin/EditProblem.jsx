import { useParams } from "react-router-dom";

const EditProblem = () => {
  const { problemId } = useParams();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Problem editor
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Edit Problem
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          Problem ID: {problemId}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
        <p className="text-sm text-zinc-500">
          Problem editing form will be added here.
        </p>
      </div>
    </div>
  );
};

export default EditProblem;
