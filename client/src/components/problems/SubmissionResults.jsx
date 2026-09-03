import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Cpu,
  Send,
  HelpCircle,
} from "lucide-react";

const SubmissionResults = ({ submission, submitting }) => {
  if (submitting) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-slate-200">
          Judging submission...
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Running your code against all test cases
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
          <Send size={20} className="text-slate-600" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-400">
          No submission yet
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Submit your solution to judge against all evaluation test cases.
        </p>
      </div>
    );
  }

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
        icon: <CheckCircle2 size={20} className="text-emerald-400" />,
      };
    }
    if (isWrongAnswer) {
      return {
        label: "Wrong Answer",
        textColor: "text-rose-400",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
        icon: <XCircle size={20} className="text-rose-400" />,
      };
    }
    if (isCompileError) {
      return {
        label: "Compile Error",
        textColor: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        icon: <AlertTriangle size={20} className="text-amber-400" />,
      };
    }
    return {
      label: isRuntimeError ? "Runtime Error" : message || "Submission Failed",
      textColor: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      icon: <AlertOctagon size={20} className="text-rose-400" />,
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
    <div className="h-full overflow-y-auto p-5 text-slate-300">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            {statusConfig.icon}
            <span className={`text-xl font-bold tracking-tight ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">{passedTests}</span> of{" "}
            <span className="font-semibold text-slate-200">{totalTests}</span> test cases passed
          </p>
        </div>

        {/* Runtime & Memory Badges */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300">
            <Clock size={13} className="text-slate-500" />
            <span>Runtime: <strong className="text-white">{formatRuntime(executionTime)}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300">
            <Cpu size={13} className="text-slate-500" />
            <span>Memory: <strong className="text-white">{formatMemory(memory)}</strong></span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Pass Rate</span>
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

      {/* Accepted Celebration Banner */}
      {isAccepted && (
        <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            <span className="text-sm font-semibold">Accepted — All Test Cases Passed!</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Your solution executed successfully within memory and time constraints for all evaluation test cases.
          </p>
        </div>
      )}

      {/* LEETCODE REVIEW SECTION: Which Test Case Failed */}
      {failedTest && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Failed Test Case #{failedTest.testNumber}
            </span>
            {failedTest.hidden && (
              <span className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                <HelpCircle size={11} />
                <span>Evaluation Test Case</span>
              </span>
            )}
          </div>

          {/* Input Block */}
          {failedTest.input !== undefined && failedTest.input !== null && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Input
              </span>
              <pre className="mt-1.5 rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-200">
                {failedTest.input || "(empty)"}
              </pre>
            </div>
          )}

          {/* Output Block (User's Output) */}
          {failedTest.actualOutput !== undefined && failedTest.actualOutput !== "" && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                Output
              </span>
              <pre className="mt-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs leading-5 text-rose-200">
                {failedTest.actualOutput}
              </pre>
            </div>
          )}

          {/* Expected Output Block */}
          {failedTest.expectedOutput !== undefined && failedTest.expectedOutput !== "" && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Expected
              </span>
              <pre className="mt-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs leading-5 text-emerald-200">
                {failedTest.expectedOutput}
              </pre>
            </div>
          )}

          {/* Stdout if user printed debugging info */}
          {failedTest.stdout && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Stdout
              </span>
              <pre className="mt-1.5 rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-300">
                {failedTest.stdout}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Compile or Runtime Error Message */}
      {(isCompileError || isRuntimeError || errorText) && (
        <div className="mt-5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
          <span className="text-xs font-semibold text-rose-400">
            {isCompileError ? "Compilation Error Output" : "Runtime Error Diagnostics"}
          </span>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-rose-300">
            {errorText || message || "Error occurred during execution"}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SubmissionResults;
