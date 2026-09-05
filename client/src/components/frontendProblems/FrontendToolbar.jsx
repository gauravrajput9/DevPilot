import { Play, RotateCcw, Package } from "lucide-react";

const FrontendToolbar = ({
  onRun,
  onReset,
  isRunning,
  onOpenDependencies,
  dependencyCount = 0,
}) => {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-zinc-900 px-3">
      {/* Left */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">
          Frontend Editor
        </span>

        <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-400">
          React
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dependencies Button */}
        <button
          type="button"
          onClick={onOpenDependencies}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
          title="Manage npm packages and dependencies"
        >
          <Package size={13} className="text-violet-400" />
          <span>Dependencies</span>
          {dependencyCount > 0 && (
            <span className="rounded bg-violet-500/20 px-1.5 py-0.2 text-[10px] font-mono text-violet-300">
              {dependencyCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-md bg-violet-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={13} />
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
};

export default FrontendToolbar;