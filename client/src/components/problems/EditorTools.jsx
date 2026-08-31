import {
  ChevronDown,
  Code2,
  RotateCcw,
  Settings2,
} from "lucide-react";

const EditorTools = ({
  language = "javascript",
  onLanguageChange,
  onReset,
}) => {
  const languages = [
    {
      value: "javascript",
      label: "JavaScript",
      short: "JS",
    },
    {
      value: "python",
      label: "Python",
      short: "PY",
    },
    {
      value: "cpp",
      label: "C++",
      short: "C++",
    },
  ];

  const currentLanguage =
    languages.find((item) => item.value === language) ||
    languages[0];

  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <div className="relative">
          <div className="flex h-8 items-center gap-2 rounded-md border border-slate-800 bg-slate-950 px-2.5">
            <Code2 size={14} className="text-slate-500" />

            <select
              value={language}
              onChange={(e) =>
                onLanguageChange?.(e.target.value)
              }
              className="cursor-pointer appearance-none bg-transparent pr-5 text-xs font-medium text-slate-300 outline-none"
            >
              {languages.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  className="bg-slate-900"
                >
                  {item.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          className="flex h-8 items-center gap-2 rounded-md px-2.5 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          title="Reset code"
        >
          <RotateCcw size={14} />

          <span className="hidden md:inline">
            Reset
          </span>
        </button>

        <button
          type="button"
          className="flex h-8 items-center justify-center rounded-md px-2 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
          title="Editor settings"
        >
          <Settings2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default EditorTools;