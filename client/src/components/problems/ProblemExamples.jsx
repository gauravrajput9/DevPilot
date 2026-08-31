const ProblemExamples = ({ examples = [] }) => {
  if (!examples.length) {
    return null;
  }

  return (
    <section className="border-t border-slate-800 bg-slate-950 p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">
          Examples
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Understand the expected input and output before solving.
        </p>
      </div>

      <div className="space-y-5">
        {examples.map((example, index) => (
          <div key={index}>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-medium text-slate-500">
                {index + 1}
              </span>

              <span className="text-xs font-medium text-slate-300">
                Example {index + 1}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              {/* Input */}
              <div className="border-b border-slate-800 p-4">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Input
                </span>

                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                  {example.input}
                </pre>
              </div>

              {/* Output */}
              <div className="border-b border-slate-800 p-4">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Output
                </span>

                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                  {example.output}
                </pre>
              </div>

              {/* Explanation */}
              {example.explanation && (
                <div className="p-4">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Explanation
                  </span>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {example.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemExamples;