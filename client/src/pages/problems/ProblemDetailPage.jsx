import { Play, Send } from "lucide-react";
import ProblemDescription from "../../components/problems/ProblemDescription";
import CodeEditor from "../../components/problems/CodeEditor";
import OutputPanel from "../../components/problems/OutputPanel";
import { useState, useEffect, useCallback } from "react";
import { runCode } from "../../services/submissionApi";
import { useNavigate, useParams } from "react-router-dom";
import { getProblem } from "../../services/problemApi";
import { PageError, PageLoading } from "../../components/ui/PageState";
import { useToast } from "../../components/ui/ToastProvider";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [language, setLanguage] = useState("javascript");

  // Store code separately for every language
  const [codes, setCodes] = useState({
    javascript: "",
    python: "",
    cpp: "",
  });

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  // Problem
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProblem(id);
      const fetchedProblem = data.problem;

      setProblem(fetchedProblem);
      setCodes({
        javascript: fetchedProblem.starterCode?.javascript || "",
        python: fetchedProblem.starterCode?.python || "",
        cpp: fetchedProblem.starterCode?.cpp || "",
      });
    } catch (error) {
      console.error("Failed to fetch problem:", error);

      const message = error.response?.data?.message || "Failed to load problem";

      setError(message);
      toast.error(message, { title: "Problem unavailable" });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  // Fetch problem
  useEffect(() => {
    void Promise.resolve().then(() => fetchProblem());
  }, [fetchProblem]);

  const handleRun = async () => {
    try {
      setRunning(true);
      setOutput("Running....");

      const result = await runCode({
        language,
        sourceCode: codes[language],
      });

      setOutput(result.output || result.stdout || result.stderr || "No output");
      toast.success("Code finished running.", { title: "Run complete" });
    } catch (error) {
      console.error("Run error:", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong while running the code.";

      setOutput(message);
      toast.error(message, { title: "Run failed" });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <PageLoading label="Loading problem..." />
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

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">
            Dev<span className="text-slate-400">Pilot</span>
          </span>

          <span className="text-slate-700">/</span>

          <span className="text-sm text-slate-400">Problems</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/problems")}
            className="rounded-md px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="grid min-h-0 flex-1 grid-cols-2">
        {/* Left */}
        <section className="min-h-0 border-r border-slate-800">
          <ProblemDescription problem={problem} />
        </section>

        {/* Right */}
        <section className="flex min-h-0 flex-col">
          {/* Editor */}
          <div className="min-h-0 flex-1">
            <CodeEditor
              language={language}
              setLanguage={setLanguage}
              code={codes[language]}
              setCode={(value) => {
                setCodes((prev) => ({
                  ...prev,
                  [language]: value,
                }));
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex h-14 shrink-0 items-center justify-end gap-3 border-t border-slate-800 bg-slate-900 px-4">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={16} />

              {running ? "Running..." : "Run"}
            </button>

            <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200">
              <Send size={16} />
              Submit
            </button>
          </div>

          {/* Output */}
          <OutputPanel output={output} />
        </section>
      </main>
    </div>
  );
};

export default ProblemDetailPage;
