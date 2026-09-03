import { Check, Plus, Play, X, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";

const TestCasePanel = ({
  testCases = [],
  language = "javascript",
  onRun,
  running = false,
  onActiveInputChange,
}) => {
  // Filter by hidden flag and allowedLanguages according to the codingTestCaseSchema
  const visibleTestCases = testCases.filter((testCase) => {
    if (testCase.hidden) return false;
    if (!testCase.allowedLanguages || testCase.allowedLanguages.length === 0) {
      return true;
    }
    return testCase.allowedLanguages.includes(language);
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [isCustomTab, setIsCustomTab] = useState(false);

  // If activeIndex is out of range due to language filtering, reset to 0
  const effectiveIndex = activeIndex < visibleTestCases.length ? activeIndex : 0;
  const activeTestCase = visibleTestCases[effectiveIndex];

  const currentEffectiveInput = isCustomTab
    ? customInput
    : customInput !== ""
    ? customInput
    : activeTestCase?.input || "";

  // Notify parent whenever active input changes
  useEffect(() => {
    onActiveInputChange?.(currentEffectiveInput, activeTestCase);
  }, [currentEffectiveInput, activeTestCase, onActiveInputChange]);

  const handleRun = () => {
    onRun?.(currentEffectiveInput, activeTestCase);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Header */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-300">
            Test Cases
          </span>

          <div className="flex items-center gap-1">
            {visibleTestCases.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setIsCustomTab(false);
                  setCustomInput("");
                }}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2.5 text-[11px] font-medium transition ${
                  !isCustomTab && effectiveIndex === index
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                Case {index + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsCustomTab(true)}
              className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium transition ${
                isCustomTab
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
              }`}
              title="Custom stdin input"
            >
              <Plus size={13} />
              <span>Custom</span>
            </button>
          </div>
        </div>

        {/* Run Test Case */}
        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="flex h-7 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={12} fill="currentColor" />
          )}
          <span>{running ? "Running..." : "Run"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-px bg-slate-800">
        {/* Input Block */}
        <div className="flex flex-col bg-slate-950 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {isCustomTab ? "Custom Input (stdin)" : "Input (stdin)"}
            </span>

            {customInput && (
              <button
                type="button"
                onClick={() => setCustomInput("")}
                className="text-slate-600 transition hover:text-slate-400"
                title="Clear input"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <textarea
            value={isCustomTab ? customInput : customInput !== "" ? customInput : activeTestCase?.input || ""}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter standard input (stdin)..."
            className="min-h-0 flex-1 resize-none rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-300 outline-none placeholder:text-slate-600 focus:border-slate-700"
          />
        </div>

        {/* Expected Output Block */}
        <div className="flex flex-col bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Expected Output
            </span>
            <Check size={12} className="text-slate-600" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-3">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-slate-400">
              {isCustomTab
                ? "Custom input execution will display stdout directly in the Test Result tab."
                : activeTestCase?.expectedOutput || "No expected output specified."}
            </pre>

            {/* Explanation from schema if present */}
            {!isCustomTab && activeTestCase?.explanation && (
              <div className="mt-2 flex items-start gap-1.5 border-t border-slate-800 pt-2 text-[11px] text-slate-500">
                <Info size={12} className="mt-0.5 shrink-0 text-slate-400" />
                <p>{activeTestCase.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCasePanel;
