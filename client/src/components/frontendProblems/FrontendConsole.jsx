import { Terminal } from "lucide-react";

const FrontendConsole = ({ output }) => {
  return (
    <div className="h-36 shrink-0 border-t border-white/10 bg-black">
      {/* Header */}
      <div className="flex h-9 items-center gap-2 border-b border-white/10 px-4">
        <Terminal size={14} className="text-zinc-500" />

        <span className="text-xs font-medium text-zinc-400">
          Console
        </span>
      </div>

      {/* Output */}
      <div className="h-[calc(100%-36px)] overflow-y-auto p-3 font-mono text-xs">
        {output.length === 0 ? (
          <span className="text-zinc-600">
            Console output will appear here...
          </span>
        ) : (
          output.map((item, index) => (
            <div
              key={index}
              className={
                item.type === "error"
                  ? "text-red-400"
                  : "text-zinc-300"
              }
            >
              {item.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FrontendConsole;