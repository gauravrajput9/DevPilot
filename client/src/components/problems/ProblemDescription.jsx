import { CheckCircle2 } from "lucide-react";

const ProblemDescription = ({ problem }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 text-slate-300">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          {problem.title}
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-400">
            {problem.difficulty}
          </span>

          <span className="text-xs text-slate-500">
            {problem.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
          {problem.description}
        </p>
      </section>

      {/* Examples */}
      {problem.examples?.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Examples
          </h2>

          <div className="space-y-5">
            {problem.examples.map((example, index) => (
              <div key={index}>
                <h3 className="mb-3 text-sm font-medium text-slate-200">
                  Example {index + 1}
                </h3>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="mb-3">
                    <span className="text-xs text-slate-500">
                      Input
                    </span>

                    <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-slate-300">
                      {example.input}
                    </pre>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">
                      Output
                    </span>

                    <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-slate-300">
                      {example.output}
                    </pre>
                  </div>

                  {example.explanation && (
                    <div className="mt-3">
                      <span className="text-xs text-slate-500">
                        Explanation
                      </span>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Constraints
          </h2>

          <ul className="space-y-2">
            {problem.constraints.map((constraint, index) => (
              <li
                key={index}
                className="text-sm leading-6 text-slate-400"
              >
                <span className="mr-2 text-slate-600">•</span>
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {problem.tags?.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-slate-400">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400"
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