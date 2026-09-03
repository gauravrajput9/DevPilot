import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Play, Send, AlertCircle, Loader2 } from "lucide-react";

import ProblemHeader from "../../components/problems/ProblemHeader";
import ProblemDescription from "../../components/problems/ProblemDescription";
import CodeEditor from "../../components/problems/CodeEditor";
import OutputPanel from "../../components/problems/OutputPanel";
import SubmissionResultModal from "../../components/problems/SubmissionResultModal";
import {
  runCode,
  submitCode,
  getSubmissionsForProblem,
} from "../../services/submissionApi";
import { getProblem } from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const [language, setLanguage] = useState("javascript");
  const [supportedLanguages, setSupportedLanguages] = useState([
    "javascript",
    "python",
    "cpp",
  ]);

  // Store code for each language
  const [codes, setCodes] = useState({
    javascript: "",
    python: "",
    cpp: "",
    java: "",
  });

  const [starterCodes, setStarterCodes] = useState({
    javascript: "",
    python: "",
    cpp: "",
    java: "",
  });

  // Active stdin & testcase tracking
  const [activeInput, setActiveInput] = useState("");
  const [activeTestCase, setActiveTestCase] = useState(null);

  // Tabs & Execution State
  const [outputTab, setOutputTab] = useState("testcases");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Submission History
  const [pastSubmissions, setPastSubmissions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const isCodingProblem = problem?.practiceType === "coding";

  // Fetch past submissions
  const fetchPastSubmissions = useCallback(async (problemId) => {
    try {
      setLoadingHistory(true);
      const data = await getSubmissionsForProblem(problemId);
      const subs = data.submissions || [];
      setPastSubmissions(subs);
      if (subs.some((sub) => sub.status === "accepted")) {
        setIsSolved(true);
      }
    } catch {
      // User may not be authenticated; non-blocking
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Fetch problem details
  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProblem(id);
      const fetchedProblem = data.problem;

      setProblem(fetchedProblem);

      const langs =
        fetchedProblem.codingConfig?.languages ||
        fetchedProblem.supportedLanguages ||
        ["javascript", "python", "cpp"];

      setSupportedLanguages(langs);

      const initialLang = langs.includes(language) ? language : langs[0] || "javascript";
      setLanguage(initialLang);

      const starters = {
        javascript:
          fetchedProblem.codingConfig?.starterCode?.javascript ||
          fetchedProblem.starterCode?.javascript ||
          "",
        python:
          fetchedProblem.codingConfig?.starterCode?.python ||
          fetchedProblem.starterCode?.python ||
          "",
        cpp:
          fetchedProblem.codingConfig?.starterCode?.cpp ||
          fetchedProblem.starterCode?.cpp ||
          "",
        java:
          fetchedProblem.codingConfig?.starterCode?.java ||
          fetchedProblem.starterCode?.java ||
          "",
      };

      setStarterCodes(starters);
      setCodes(starters);

      if (fetchedProblem.practiceType === "coding") {
        void fetchPastSubmissions(fetchedProblem._id);
      }
    } catch (err) {
      console.error("Failed to fetch problem:", err);
      const message = err.response?.data?.message || "Failed to load problem";
      setError(message);
      toast.error(message, { title: "Problem unavailable" });
    } finally {
      setLoading(false);
    }
  }, [id, language, fetchPastSubmissions, toast]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProblem());
  }, [fetchProblem]);

  // Synchronize active input from test case panel
  const handleActiveInputChange = useCallback((input, testCase) => {
    setActiveInput(input);
    setActiveTestCase(testCase || null);
  }, []);

  // Reset current language code to starter code
  const handleResetCode = () => {
    const starter = starterCodes[language] || "";
    setCodes((prev) => ({
      ...prev,
      [language]: starter,
    }));
    toast.info("Editor code reset to initial starter code.", {
      title: "Code reset",
    });
  };

  // Run code against testcase or custom stdin
  const handleRun = async (overrideInput, overrideTestCase) => {
    if (!isCodingProblem) {
      toast.warning(
        "Code execution is only supported for Coding problems.",
        { title: "Execution disabled" }
      );
      return;
    }

    const inputToUse =
      overrideInput !== undefined ? overrideInput : activeInput;
    const testCaseToUse =
      overrideTestCase !== undefined ? overrideTestCase : activeTestCase;

    try {
      setRunning(true);
      setOutputTab("result");

      const result = await runCode({
        language,
        sourceCode: codes[language] || "",
        stdin: inputToUse,
      });

      setRunResult({
        ...result,
        input: inputToUse,
        expectedOutput: testCaseToUse?.expectedOutput,
      });

      if (result.status === "accepted") {
        toast.success("Execution completed successfully.", {
          title: "Run complete",
        });
      } else if (result.status === "compile_error") {
        toast.error("Compilation error in your code.", {
          title: "Compilation failed",
        });
      } else {
        toast.warning("Runtime error encountered during execution.", {
          title: "Runtime error",
        });
      }
    } catch (err) {
      console.error("Run error:", err);
      const message =
        err.response?.data?.message ||
        "An unexpected error occurred while executing the code.";

      setRunResult({
        status: "runtime_error",
        output: message,
        stderr: message,
        input: inputToUse,
      });
      toast.error(message, { title: "Run failed" });
    } finally {
      setRunning(false);
    }
  };

  // Submit code to backend judge against all test cases
  const handleSubmit = async () => {
    if (!isCodingProblem) {
      toast.warning(
        "Code submission is only supported for Coding problems.",
        { title: "Submission disabled" }
      );
      return;
    }

    try {
      setSubmitting(true);
      setOutputTab("submission");

      const result = await submitCode({
        problemId: problem._id,
        language,
        sourceCode: codes[language] || "",
      });

      setSubmissionResult(result);
      setIsResultModalOpen(true);

      const passMsg = `${result.message || "Submitted"} (${result.passedTests}/${result.totalTests} tests passed)`;

      if (result.status === "accepted") {
        setIsSolved(true);
        toast.success(passMsg, { title: "Accepted! 🎉" });
      } else {
        toast.warning(passMsg, { title: result.message || "Submission evaluated" });
      }

      // Refresh submissions history
      void fetchPastSubmissions(problem._id);
    } catch (err) {
      console.error("Submit error:", err);

      if (err.response?.status === 401) {
        const authMsg = "Please sign in to submit your solution and record your progress.";
        setSubmissionResult({
          status: "unauthorized",
          message: authMsg,
        });
        toast.error(authMsg, { title: "Sign in required" });
      } else {
        const message =
          err.response?.data?.message ||
          "An unexpected error occurred while submitting the code.";

        setSubmissionResult({
          status: "runtime_error",
          message,
        });
        setIsResultModalOpen(true);
        toast.error(message, { title: "Submission failed" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <PageLoading label="Loading problem details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <PageError
          title="Problem could not be loaded"
          message={error}
          onAction={fetchProblem}
        />
      </div>
    );
  }

  if (!problem) {
    return null;
  }

  const problemTestCases =
    problem.codingConfig?.testCases || problem.testCases || [];

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Top Problem Header */}
      <ProblemHeader problem={problem} solved={isSolved} />

      {/* Non-coding Notice Banner */}
      {!isCodingProblem && (
        <div className="flex shrink-0 items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-5 py-2.5 text-xs text-amber-300">
          <AlertCircle size={15} className="shrink-0 text-amber-400" />
          <span>
            Code execution and automated judging are currently supported for{" "}
            <strong>Coding problems</strong> only. Frontend and backend practice environments
            are in active development.
          </span>
        </div>
      )}

      {/* Main Workspace */}
      <main className="grid min-h-0 flex-1 grid-cols-2">
        {/* Left: Problem Details & Description */}
        <section className="min-h-0 border-r border-slate-800">
          <ProblemDescription problem={problem} />
        </section>

        {/* Right: Code Editor & Execution Workbench */}
        <section className="flex min-h-0 flex-col">
          {/* Editor */}
          <div className="min-h-0 flex-1">
            <CodeEditor
              language={language}
              setLanguage={setLanguage}
              supportedLanguages={supportedLanguages}
              code={codes[language] || ""}
              setCode={(value) => {
                setCodes((prev) => ({
                  ...prev,
                  [language]: value,
                }));
              }}
              onReset={handleResetCode}
            />
          </div>

          {/* Action Bar */}
          <div className="flex h-13 shrink-0 items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-900 px-4 py-2">
            <button
              type="button"
              onClick={() => handleRun()}
              disabled={running || !isCodingProblem}
              className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                !isCodingProblem
                  ? "Execution available for coding problems only"
                  : "Run code against active test case or custom input"
              }
            >
              {running ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Play size={14} />
              )}
              <span>{running ? "Running..." : "Run"}</span>
            </button>

            {submissionResult && (
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                title="Open LeetCode submission result review"
              >
                <span>Result Review</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={running || submitting || !isCodingProblem}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                !isCodingProblem
                  ? "Judging available for coding problems only"
                  : "Submit code to judge against all test cases"
              }
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin text-slate-950" />
              ) : (
                <Send size={14} />
              )}
              <span>{submitting ? "Submitting..." : "Submit"}</span>
            </button>
          </div>

          {/* Output / Test Case Workbench */}
          <OutputPanel
            activeTab={outputTab}
            setActiveTab={setOutputTab}
            testCases={problemTestCases}
            language={language}
            onRun={(input, tc) => handleRun(input, tc)}
            running={running}
            submitting={submitting}
            onActiveInputChange={handleActiveInputChange}
            runResult={runResult}
            submissionResult={submissionResult}
            pastSubmissions={pastSubmissions}
            loadingHistory={loadingHistory}
            onSelectSubmission={(sub) => {
              setSubmissionResult(sub);
              setOutputTab("submission");
              setIsResultModalOpen(true);
            }}
          />
        </section>
      </main>

      {/* LeetCode-style Result Window Modal */}
      <SubmissionResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        submission={submissionResult}
      />
    </div>
  );
};

export default ProblemDetailPage;
