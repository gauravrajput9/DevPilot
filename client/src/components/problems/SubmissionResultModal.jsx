import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Cpu,
  X,
  HelpCircle,
} from "lucide-react";

const SubmissionResultModal = ({ isOpen, onClose, submission }) => {
  if (!isOpen || !submission) return null;

  const {
    status,
    message,
    passedTests = 0,
    totalTests = 0,
    executionTime,
    memory,
    failedTest,
    error,
  } = submission;

  const isAccepted = status === "accepted";
  const isWrongAnswer = status === "wrong_answer";
  const isCompileError = status === "compile_error";
  const isRuntimeError = status === "runtime_error";

  const getStatusConfig = () => {
    if (isAccepted) {
      return {
        label: "Accepted",
        textColor: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        icon: <CheckCircle2 size={26} className="text-emerald-400" />,
      };
    }
    if (isWrongAnswer) {
      return {
        label: "Wrong Answer",
        textColor: "text-rose-400",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
        icon: <XCircle size={26} className="text-rose-400" />,
      };
    }
    if (isCompileError) {
      return {
        label: "Compile Error",
        textColor: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        icon: <AlertTriangle size={26} className="text-amber-400" />,
      };
    }
    return {
      label: isRuntimeError ? "Runtime Error" : message || "Submission Failed",
      textColor: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      icon: <AlertOctagon size={26} className="text-rose-400" />,
    };
  };

  const statusConfig = getStatusConfig();
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const formatRuntime = (time) => {
    if (time === null || time === undefined) return "N/A";
    if (time < 1) return `${Math.round(time * 1000)} ms`;
    return `${Number(time).toFixed(2)} s`;
  };

  const formatMemory = (mem) => {
    if (mem === null || mem === undefined) return "N/A";
    if (mem >= 1024) return `${(mem / 1024).toFixed(1)} MB`;
    return `${mem} KB`;
  };

  const errorText = failedTest?.error || error || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/90 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${statusConfig.textColor}`}>
                {statusConfig.label}
              </h2>
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{passedTests}</span> /{" "}
                <span className="font-semibold text-slate-200">{totalTests}</span> test cases passed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Close result window"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <Clock size={16} className="text-slate-400" />
              <div>
                <span className="text-[11px] text-slate-500">Runtime</span>
                <p className="font-semibold text-white">{formatRuntime(executionTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <Cpu size={16} className="text-slate-400" />
              <div>
                <span className="text-[11px] text-slate-500">Memory</span>
                <p className="font-semibold text-white">{formatMemory(memory)}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Test Cases Pass Rate</span>
              <span className="font-mono">{passRate}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  isAccepted
                    ? "bg-emerald-500"
                    : passRate > 0
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>

          {/* Accepted Success Banner */}
          {isAccepted && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-emerald-300">
                All Evaluation Test Cases Passed!
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Great job! Your solution passed all test cases within the required limits.
              </p>
            </div>
          )}

          {/* Failed Test Case Review (LeetCode style) */}
          {failedTest && (
            <div className="space-y-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Failed on Test Case #{failedTest.testNumber}
                </span>
                {failedTest.hidden && (
                  <span className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                    <HelpCircle size={11} />
                    <span>Evaluation Test Case</span>
                  </span>
                )}
              </div>

              {/* Input Box */}
              {failedTest.input !== undefined && failedTest.input !== null && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Input
                  </span>
                  <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-200">
                    {failedTest.input || "(empty)"}
                  </pre>
                </div>
              )}

              {/* Output Box */}
              {failedTest.actualOutput !== undefined && failedTest.actualOutput !== "" && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                    Output (Your Solution)
                  </span>
                  <pre className="mt-1.5 overflow-x-auto rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs leading-5 text-rose-200">
                    {failedTest.actualOutput}
                  </pre>
                </div>
              )}

              {/* Expected Box */}
              {failedTest.expectedOutput !== undefined && failedTest.expectedOutput !== "" && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Expected Output
                  </span>
                  <pre className="mt-1.5 overflow-x-auto rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs leading-5 text-emerald-200">
                    {failedTest.expectedOutput}
                  </pre>
                </div>
              )}

              {/* Stdout */}
              {failedTest.stdout && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Stdout
                  </span>
                  <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-300">
                    {failedTest.stdout}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Compilation or Runtime Error Box */}
          {(isCompileError || isRuntimeError || errorText) && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
              <span className="text-xs font-semibold text-rose-400">
                {isCompileError ? "Compilation Error Diagnostics" : "Runtime Error Diagnostics"}
              </span>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs text-rose-300">
                {errorText || message || "Error occurred during execution"}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/60 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            Close & Review Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultModal;
