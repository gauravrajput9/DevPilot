import {
  Check,
  Plus,
  Play,
  X,
} from "lucide-react";
import { useState } from "react";

const TestCasePanel = ({
  testCases = [],
  onRun,
}) => {
  const visibleTestCases = testCases.filter(
    (testCase) => !testCase.hidden
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const [customInput, setCustomInput] = useState("");

  const activeTestCase =
    visibleTestCases[activeIndex];

  const handleRun = () => {
    onRun?.(
      customInput !== ""
        ? customInput
        : activeTestCase?.input || ""
    );
  };

  return (
    <div className="flex h-[230px] shrink-0 flex-col border-t border-slate-800 bg-slate-950">
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
                  setCustomInput("");
                }}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[11px] transition ${
                  activeIndex === index
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-900 hover:text-slate-400"
                }`}
              >
                Case {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-900 hover:text-slate-300"
              title="Add custom test case"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Run */}
        <button
          type="button"
          onClick={handleRun}
          className="flex h-8 items-center gap-2 rounded-md bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-200"
        >
          <Play size={13} fill="currentColor" />
          Run
        </button>
      </div>

      {/* Content */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-px bg-slate-800">
        {/* Input */}
        <div className="bg-slate-950 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Input
            </span>

            {customInput && (
              <button
                type="button"
                onClick={() => setCustomInput("")}
                className="text-slate-700 transition hover:text-slate-400"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <textarea
            value={
              customInput !== ""
                ? customInput
                : activeTestCase?.input || ""
            }
            onChange={(e) =>
              setCustomInput(e.target.value)
            }
            placeholder="Enter custom input..."
            className="h-[105px] w-full resize-none rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-300 outline-none placeholder:text-slate-700 focus:border-slate-700"
          />
        </div>

        {/* Expected Output */}
        <div className="bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Expected Output
            </span>

            <Check
              size={12}
              className="text-slate-700"
            />
          </div>

          <div className="h-[105px] overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-3">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-slate-400">
              {activeTestCase?.expectedOutput ||
                "No expected output available."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCasePanel;