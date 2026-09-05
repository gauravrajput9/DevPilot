import Editor from "@monaco-editor/react";
import {
  vsCodeEditorOptions,
  setupCodingLanguages,
} from "../../utils/monacoSuggestions";

const ALL_LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    monaco: "javascript",
  },
  {
    value: "python",
    label: "Python",
    monaco: "python",
  },
  {
    value: "cpp",
    label: "C++",
    monaco: "cpp",
  },
  {
    value: "java",
    label: "Java",
    monaco: "java",
  },
];

const CodeEditor = ({
  code,
  setCode,
  language,
  setLanguage,
  supportedLanguages = ["javascript", "python", "cpp"],
  onReset,
}) => {
  const availableLanguages = ALL_LANGUAGES.filter((item) =>
    supportedLanguages.includes(item.value)
  );

  const effectiveLanguages =
    availableLanguages.length > 0 ? availableLanguages : ALL_LANGUAGES;

  const currentLangConfig =
    ALL_LANGUAGES.find((item) => item.value === language) || ALL_LANGUAGES[0];

  const handleEditorWillMount = (monaco) => {
    setupCodingLanguages(monaco);
  };

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Editor Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Code</span>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 outline-none transition focus:border-slate-500"
          >
            {effectiveLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onReset) {
              onReset();
            } else {
              setCode("");
            }
          }}
          className="text-xs text-slate-500 transition hover:text-slate-300"
          title="Reset to starter code"
        >
          Reset
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={currentLangConfig.monaco}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          beforeMount={handleEditorWillMount}
          options={vsCodeEditorOptions}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
