import { Terminal } from "lucide-react";

const OutputPanel = ({ output }) => {
  return (
    <div className="h-52 shrink-0 border-t border-slate-800 bg-slate-950">
      <div className="flex h-11 items-center gap-2 border-b border-slate-800 px-4">
        <Terminal size={16} className="text-slate-500" />

        <span className="text-sm font-medium text-slate-300">Output</span>
      </div>

      <div className="p-4">
        {output ? (
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">
            {output}
          </pre>
        ) : (
          <p className="text-sm text-slate-500">
            Run your code to see the output here.
          </p>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
