import Editor from "@monaco-editor/react";

const EDITOR_LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "cpp",
    label: "C++",
  },
];

const CodeEditor = ({ code, setCode, language, setLanguage }) => {
  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Editor Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Code</span>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-slate-500"
          >
            {EDITOR_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCode("")}
          className="text-xs text-slate-500 transition hover:text-slate-300"
        >
          Reset
        </button>
      </div>

      {/* Monaco */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            padding: {
              top: 16,
            },
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
