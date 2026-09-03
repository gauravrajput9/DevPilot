import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Cpu,
  History,
  Send,
  ListChecks,
} from "lucide-react";
import TestCasePanel from "./TestCasePanel";
import SubmissionResults from "./SubmissionResults";

const OutputPanel = ({
  activeTab = "testcases",
  setActiveTab,
  testCases = [],
  language = "javascript",
  onRun,
  running = false,
  submitting = false,
  onActiveInputChange,
  runResult,
  submissionResult,
  pastSubmissions = [],
  loadingHistory = false,
  onSelectSubmission,
}) => {
  const normalizeOutput = (val = "") => {
    return String(val).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  };

  const renderRunResult = () => {
    if (running) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <p className="mt-3 text-xs font-medium text-slate-300">Running your code...</p>
          <p className="mt-1 text-[11px] text-slate-500">Executing against standard input</p>
        </div>
      );
    }

    if (!runResult) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500">
          <Terminal size={22} className="text-slate-600" />
          <p className="mt-3 text-xs font-medium text-slate-400">No execution output yet</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Click Run to execute your code with test case or custom input.
          </p>
        </div>
      );
    }

    const {
      status,
      stdout = "",
      stderr = "",
      output = "",
      wallTime,
      memory,
      input,
      expectedOutput,
    } = runResult;

    const actualOutput = stdout || output;
    const hasExpected = expectedOutput !== undefined && expectedOutput !== null && expectedOutput !== "";
    const isCompileError = status === "compile_error";
    const isRuntimeError = status === "runtime_error";
    const isMatch = hasExpected && normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);

    return (
      <div className="h-full overflow-y-auto p-4 text-slate-300">
        {/* Status header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {isCompileError ? (
              <span className="flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                <AlertTriangle size={14} /> Compilation Error
              </span>
            ) : isRuntimeError ? (
              <span className="flex items-center gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                <AlertOctagon size={14} /> Runtime Error
              </span>
            ) : hasExpected ? (
              isMatch ? (
                <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={14} /> Test Passed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                  <XCircle size={14} /> Wrong Answer
                </span>
              )
            ) : (
              <span className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={14} className="text-slate-400" /> Finished Execution
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {wallTime !== null && wallTime !== undefined && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {wallTime < 1 ? `${Math.round(wallTime * 1000)} ms` : `${wallTime}s`}
              </span>
            )}
            {memory !== null && memory !== undefined && (
              <span className="flex items-center gap-1">
                <Cpu size={12} /> {memory >= 1024 ? `${(memory / 1024).toFixed(1)} MB` : `${memory} KB`}
              </span>
            )}
          </div>
        </div>

        {/* Input */}
        {input !== undefined && input !== null && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Input (stdin)
            </span>
            <pre className="mt-1 rounded-md border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-slate-300">
              {input || "(empty)"}
            </pre>
          </div>
        )}

        {/* Output */}
        <div className="mt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Your Output (stdout)
          </span>
          <pre className="mt-1 rounded-md border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-slate-300">
            {actualOutput || "(No stdout output)"}
          </pre>
        </div>

        {/* Expected Output if available */}
        {hasExpected && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Expected Output
            </span>
            <pre className="mt-1 rounded-md border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-slate-400">
              {expectedOutput}
            </pre>
          </div>
        )}

        {/* Stderr / Compiler Output */}
        {stderr && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
              Errors (stderr)
            </span>
            <pre className="mt-1 rounded-md border border-rose-500/20 bg-rose-500/10 p-2.5 font-mono text-xs text-rose-300">
              {stderr}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    if (loadingHistory) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-xs text-slate-500">
          Loading previous submissions...
        </div>
      );
    }

    if (!pastSubmissions || pastSubmissions.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500">
          <History size={20} className="text-slate-600" />
          <p className="mt-3 text-xs font-medium text-slate-400">No submissions found</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Your previous attempts on this problem will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto p-3 text-xs">
        <div className="space-y-2">
          {pastSubmissions.map((sub, idx) => {
            const isAcc = sub.status === "accepted";
            const dateStr = sub.createdAt
              ? new Date(sub.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            return (
              <button
                key={sub._id || idx}
                type="button"
                onClick={() => onSelectSubmission?.(sub)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  {isAcc ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-rose-400" />
                  )}
                  <div>
                    <span
                      className={`font-semibold capitalize ${
                        isAcc ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {sub.status?.replace("_", " ") || "Failed"}
                    </span>
                    <span className="ml-2 text-slate-500">
                      ({sub.passedTests || 0}/{sub.totalTests || 0} passed)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-mono text-slate-400">
                    {sub.language}
                  </span>
                  <span>{dateStr}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[280px] shrink-0 flex-col border-t border-slate-800 bg-slate-950">
      {/* Top Tabs */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-3">
        <div className="flex items-center gap-1">
          {/* Test Cases Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("testcases")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "testcases"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <ListChecks size={14} />
            <span>Test Cases</span>
          </button>

          {/* Test Result Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("result")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "result"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <Terminal size={14} />
            <span>Test Result</span>
            {runResult && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  runResult.status === "accepted" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            )}
          </button>

          {/* Submission Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("submission")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "submission"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <Send size={13} />
            <span>Submission</span>
            {submissionResult && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  submissionResult.status === "accepted" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            )}
          </button>

          {/* History Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "history"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <History size={13} />
            <span>Submissions</span>
            {pastSubmissions.length > 0 && (
              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                {pastSubmissions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-0 flex-1">
        {activeTab === "testcases" && (
          <TestCasePanel
            testCases={testCases}
            language={language}
            onRun={onRun}
            running={running}
            onActiveInputChange={onActiveInputChange}
          />
        )}

        {activeTab === "result" && renderRunResult()}

        {activeTab === "submission" && (
          <SubmissionResults
            submission={submissionResult}
            submitting={submitting}
          />
        )}

        {activeTab === "history" && renderHistory()}
      </div>
    </div>
  );
};

export default OutputPanel;
