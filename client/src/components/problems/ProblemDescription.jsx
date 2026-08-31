const ProblemDescription = ({ problem }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 text-slate-300">
      {/* Title */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {problem.title}
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-400">
            {problem.difficulty}
          </span>

          <span className="text-xs text-slate-600">•</span>

          <span className="text-xs capitalize text-slate-500">
            {problem.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="mb-9">
        <h2 className="mb-3 text-sm font-semibold text-white">
          Description
        </h2>

        <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
          {problem.description}
        </p>
      </section>

      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <section className="mb-9">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Constraints
          </h2>

          <ul className="space-y-2.5">
            {problem.constraints.map((constraint, index) => (
              <li
                key={index}
                className="flex text-sm leading-6 text-slate-400"
              >
                <span className="mr-3 select-none text-slate-700">
                  •
                </span>

                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {problem.tags?.length > 0 && (
        <section className="pb-6">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProblemDescription;