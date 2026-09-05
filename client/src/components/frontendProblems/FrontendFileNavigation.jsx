import { useState, useEffect, useRef, useMemo } from "react";
import {
  FileCode2,
  FileText,
  Folder,
  ChevronRight,
  X,
  Plus,
  Hash,
  Globe,
  Braces,
  Code2,
} from "lucide-react";

/* =========================================================
   FILE ICON HELPER
========================================================= */

const getFileIcon = (name = "", size = 14) => {
  const ext = name.split(".").pop().toLowerCase();
  switch (ext) {
    case "jsx":
    case "tsx":
      return <FileCode2 size={size} className="shrink-0 text-sky-400" />;
    case "js":
    case "ts":
      return <FileCode2 size={size} className="shrink-0 text-yellow-400" />;
    case "css":
      return <Hash size={size} className="shrink-0 text-cyan-400" />;
    case "html":
      return <Globe size={size} className="shrink-0 text-orange-400" />;
    case "json":
      return <Braces size={size} className="shrink-0 text-amber-400" />;
    default:
      return <FileText size={size} className="shrink-0 text-zinc-400" />;
  }
};

/* =========================================================
   FIND ITEM & PATH HELPERS
========================================================= */

const findItemAndPath = (items, targetId, currentPath = []) => {
  for (const item of items) {
    const nextPath = [...currentPath, item];
    if (item.id === targetId) {
      return { item, path: nextPath };
    }
    if (item.type === "folder" && Array.isArray(item.children)) {
      const found = findItemAndPath(item.children, targetId, nextPath);
      if (found) return found;
    }
  }
  return null;
};

const findItemById = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.type === "folder" && Array.isArray(item.children)) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

/* =========================================================
   COMPONENT: FRONTEND FILE NAVIGATION (VS CODE TABS + BREADCRUMBS)
========================================================= */

const FrontendFileNavigation = ({
  files = [],
  openFileIds = [],
  activeFileId,
  onSelectFile,
  onCloseFile,
  onCreateFile,
}) => {
  const [dropdownSegmentId, setDropdownSegmentId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownSegmentId(null);
      }
    };
    if (dropdownSegmentId) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownSegmentId]);

  // Compute breadcrumb path from tree
  const activePathData = useMemo(() => {
    if (!activeFileId) return [];
    const res = findItemAndPath(files, activeFileId);
    return res ? res.path : [];
  }, [files, activeFileId]);

  // Extract top-level symbol (e.g. Component or function name) from active file
  const activeSymbol = useMemo(() => {
    if (!activeFileId) return null;
    const item = findItemById(files, activeFileId);
    if (!item || !item.content) return null;
    const match = item.content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/) ||
      item.content.match(/function\s+([A-Za-z0-9_]+)/) ||
      item.content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*(?:=>|function)/);
    return match ? match[1] : null;
  }, [files, activeFileId]);

  return (
    <div className="flex shrink-0 flex-col border-b border-white/10 bg-zinc-950 select-none">
      {/* ===================================================
          1. VS CODE EDITOR TABS BAR
      =================================================== */}
      <div className="flex h-[35px] items-center overflow-x-auto overflow-y-hidden border-b border-white/5 bg-[#141416] scrollbar-none">
        <div className="flex h-full min-w-0 flex-1 items-center">
          {openFileIds.map((fileId) => {
            const fileItem = findItemById(files, fileId);
            if (!fileItem) return null;

            const isActive = fileId === activeFileId;

            return (
              <div
                key={fileId}
                onClick={() => onSelectFile(fileId)}
                className={`group flex h-full min-w-[120px] max-w-[200px] cursor-pointer items-center justify-between border-r border-zinc-800/80 px-3 text-xs transition-colors ${
                  isActive
                    ? "border-t-2 border-t-sky-500 bg-[#1e1e1e] text-white"
                    : "border-t-2 border-t-transparent bg-[#141416] text-zinc-400 hover:bg-[#1a1a1d] hover:text-zinc-200"
                }`}
                title={fileItem.name}
              >
                {/* File Icon & Name */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-1">
                  {getFileIcon(fileItem.name, 14)}
                  <span className="truncate text-xs font-mono">{fileItem.name}</span>
                </div>

                {/* Close Tab Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(fileId);
                  }}
                  className={`flex h-4 w-4 items-center justify-center rounded transition-opacity ${
                    isActive
                      ? "text-zinc-400 hover:bg-white/10 hover:text-white"
                      : "opacity-0 group-hover:opacity-100 text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
                  }`}
                  title="Close (Ctrl+W)"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          {/* If no tabs open, prompt */}
          {openFileIds.length === 0 && (
            <div className="px-3 text-xs italic text-zinc-600">
              No files open
            </div>
          )}
        </div>

        {/* New File Quick Button */}
        <div className="flex h-full items-center px-2">
          <button
            type="button"
            onClick={() => onCreateFile && onCreateFile()}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
            title="New File"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* ===================================================
          2. VS CODE BREADCRUMBS BAR
      =================================================== */}
      {activePathData.length > 0 && (
        <div className="relative flex h-[26px] items-center gap-1 bg-[#1e1e1e] px-3 text-[11px] font-mono text-zinc-400">
          {activePathData.map((item, index) => {
            const isLast = index === activePathData.length - 1 && !activeSymbol;
            const isFolder = item.type === "folder";

            return (
              <div key={item.id} className="relative flex items-center gap-1">
                {/* Segment Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isFolder) {
                      setDropdownSegmentId((prev) => (prev === item.id ? null : item.id));
                    }
                  }}
                  className={`flex items-center gap-1 rounded px-1 py-0.5 transition ${
                    isLast
                      ? "text-zinc-200 font-medium"
                      : "hover:bg-white/5 hover:text-zinc-200 cursor-pointer"
                  }`}
                >
                  {isFolder ? (
                    <Folder size={12} className="text-sky-400/80" />
                  ) : (
                    getFileIcon(item.name, 12)
                  )}
                  <span>{item.name}</span>
                </button>

                {/* Dropdown Menu for Folder */}
                {dropdownSegmentId === item.id && isFolder && Array.isArray(item.children) && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-2xl"
                  >
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {item.name}
                    </div>
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          if (child.type === "file") {
                            onSelectFile(child.id);
                          }
                          setDropdownSegmentId(null);
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        {child.type === "folder" ? (
                          <Folder size={13} className="text-sky-400" />
                        ) : (
                          getFileIcon(child.name, 13)
                        )}
                        <span className="truncate">{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Separator Chevron */}
                {(index < activePathData.length - 1 || activeSymbol) && (
                  <ChevronRight size={11} className="text-zinc-600" />
                )}
              </div>
            );
          })}

          {/* Symbol Segment if detected (e.g. Button component) */}
          {activeSymbol && (
            <div className="flex items-center gap-1 text-zinc-300">
              <Code2 size={12} className="text-emerald-400" />
              <span>{activeSymbol}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrontendFileNavigation;

