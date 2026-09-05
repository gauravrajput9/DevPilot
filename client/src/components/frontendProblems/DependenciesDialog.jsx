import { useState, useMemo, useEffect } from "react";
import {
  Package,
  Search,
  X,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";

/* =========================================================
   CURATED RECOMMENDED PACKAGES
========================================================= */

const RECOMMENDED_PACKAGES = [
  {
    name: "axios",
    version: "^1.7.9",
    description: "Promise based HTTP client for the browser and node.js",
    category: "HTTP",
  },
  {
    name: "lucide-react",
    version: "^0.468.0",
    description: "Beautiful & consistent icon toolkit for React",
    category: "UI",
  },
  {
    name: "framer-motion",
    version: "^11.15.0",
    description: "Production-ready motion animation library for React",
    category: "Animation",
  },
  {
    name: "react-router-dom",
    version: "^6.28.0",
    description: "Declarative client-side routing for React applications",
    category: "Routing",
  },
  {
    name: "@tanstack/react-query",
    version: "^5.62.7",
    description: "Powerful asynchronous state management & data fetching",
    category: "Data",
  },
  {
    name: "zustand",
    version: "^5.0.2",
    description: "Bear-essential state management for React",
    category: "State",
  },
  {
    name: "react-hook-form",
    version: "^7.54.1",
    description: "Performant, flexible forms with easy validation",
    category: "Forms",
  },
  {
    name: "date-fns",
    version: "^4.1.0",
    description: "Modern JavaScript date utility library",
    category: "Utilities",
  },
  {
    name: "lodash",
    version: "^4.17.21",
    description: "Modular utility library delivering performance & extras",
    category: "Utilities",
  },
  {
    name: "canvas-confetti",
    version: "^1.9.3",
    description: "Performant confetti celebrations in the browser",
    category: "UI",
  },
  {
    name: "clsx",
    version: "^2.1.1",
    description: "Utility for constructing className strings conditionally",
    category: "Utilities",
  },
  {
    name: "tailwindcss",
    version: "^3.4.17",
    description: "Utility-first CSS framework for rapid UI styling",
    category: "Styling",
  },
];

const CORE_PACKAGES = new Set(["react", "react-dom"]);

/* =========================================================
   DEPENDENCIES DIALOG COMPONENT
========================================================= */

const DependenciesDialog = ({
  isOpen,
  onClose,
  dependencies = {},
  onAddDependency,
  onRemoveDependency,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Installed list entries
  const installedEntries = useMemo(() => {
    return Object.entries(dependencies || {}).map(([name, version]) => ({
      name,
      version,
      isCore: CORE_PACKAGES.has(name),
    }));
  }, [dependencies]);

  // Filter recommended packages by search
  const filteredRecommended = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return RECOMMENDED_PACKAGES;

    return RECOMMENDED_PACKAGES.filter((pkg) => {
      return (
        pkg.name.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Check if search term is a custom package not already in recommended or installed
  const cleanSearch = searchQuery.trim().toLowerCase();
  const isCustomPackage =
    cleanSearch &&
    !RECOMMENDED_PACKAGES.some((pkg) => pkg.name.toLowerCase() === cleanSearch) &&
    !Object.prototype.hasOwnProperty.call(dependencies, cleanSearch);

  const handleAdd = (pkgName, pkgVersion = "latest") => {
    if (Object.prototype.hasOwnProperty.call(dependencies, pkgName)) {
      setNotification({
        type: "info",
        message: `Package "${pkgName}" is already installed.`,
      });
      return;
    }

    onAddDependency(pkgName, pkgVersion);
    setNotification({
      type: "success",
      message: `Added "${pkgName}" (${pkgVersion}) to dependencies.`,
    });
  };

  const handleRemove = (pkgName) => {
    if (CORE_PACKAGES.has(pkgName)) {
      setNotification({
        type: "error",
        message: `"${pkgName}" is a core dependency and cannot be removed.`,
      });
      return;
    }

    onRemoveDependency(pkgName);
    setNotification({
      type: "success",
      message: `Removed "${pkgName}" from dependencies.`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      {/* Modal Dialog */}
      <div
        className="flex h-[620px] w-full max-w-2xl flex-col rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Package size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Project Dependencies
              </h2>
              <p className="text-[11px] text-zinc-400">
                Manage npm packages & libraries synchronized with package.json
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/10 hover:text-white"
            title="Close dialog (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* =================================================
            SEARCH INPUT
        ================================================= */}
        <div className="shrink-0 border-b border-zinc-800/80 bg-zinc-950 px-5 py-3">
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3 text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages by name, description, or category..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pr-9 pl-9 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            NOTIFICATION TOAST
        ================================================= */}
        {notification && (
          <div
            className={`flex items-center gap-2 px-5 py-2 text-xs transition ${
              notification.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20"
                : notification.type === "error"
                ? "bg-rose-500/10 text-rose-400 border-b border-rose-500/20"
                : "bg-blue-500/10 text-blue-400 border-b border-blue-500/20"
            }`}
          >
            <Info size={14} className="shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* =================================================
            BODY: INSTALLED & AVAILABLE PACKAGES
        ================================================= */}
        <div className="flex flex-1 min-h-0 divide-x divide-zinc-800/80 overflow-hidden">
          {/* ---------------------------------------------
              LEFT: INSTALLED PACKAGES
          --------------------------------------------- */}
          <div className="flex w-1/2 flex-col overflow-hidden bg-zinc-950/50">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/60 px-4 py-2.5 bg-zinc-900/30">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Installed ({installedEntries.length})
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">package.json</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              {installedEntries.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No packages installed.
                </div>
              ) : (
                installedEntries.map(({ name, version, isCore }) => (
                  <div
                    key={name}
                    className="group flex items-center justify-between rounded-lg border border-zinc-800/70 bg-zinc-900/60 px-3 py-2 text-xs transition hover:border-zinc-700/80 hover:bg-zinc-900"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-zinc-200 truncate">
                          {name}
                        </span>
                        {isCore && (
                          <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-medium text-sky-400">
                            Core
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {version}
                      </span>
                    </div>

                    {!isCore ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(name)}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                        title={`Remove ${name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-600 select-none">
                        Required
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ---------------------------------------------
              RIGHT: RECOMMENDED & SEARCH RESULTS
          --------------------------------------------- */}
          <div className="flex w-1/2 flex-col overflow-hidden bg-zinc-950">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/60 px-4 py-2.5 bg-zinc-900/30">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <Sparkles size={12} className="text-violet-400" />
                {searchQuery ? "Search Results" : "Recommended Packages"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {/* Custom Package Add Option */}
              {isCustomPackage && (
                <div className="rounded-lg border border-dashed border-violet-500/40 bg-violet-500/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-violet-300">
                          {cleanSearch}
                        </span>
                        <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[9px] text-violet-300">
                          Custom
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Install custom npm package from registry
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(cleanSearch, "latest")}
                      className="flex shrink-0 items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-violet-500"
                    >
                      <Plus size={13} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Filtered Packages */}
              {filteredRecommended.length === 0 && !isCustomPackage ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No matching packages found.
                </div>
              ) : (
                filteredRecommended.map((pkg) => {
                  const isInstalled = Object.prototype.hasOwnProperty.call(
                    dependencies,
                    pkg.name
                  );

                  return (
                    <div
                      key={pkg.name}
                      className="flex flex-col gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2.5 text-xs transition hover:border-zinc-700 hover:bg-zinc-900/80"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-medium text-zinc-200">
                            {pkg.name}
                          </span>
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400">
                            {pkg.category}
                          </span>
                        </div>

                        {isInstalled ? (
                          <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                            <Check size={11} />
                            <span>Installed</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdd(pkg.name, pkg.version)}
                            className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition hover:bg-violet-600 hover:text-white"
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-tight">
                        {pkg.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                        <span>{pkg.version}</span>
                        <a
                          href={`https://www.npmjs.com/package/${pkg.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300"
                        >
                          <span>npm</span>
                          <ExternalLink size={9} />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-800/80 bg-zinc-900/60 px-5 py-3 text-[11px] text-zinc-500">
          <span>
            Changes are immediately saved to <code className="text-zinc-400">package.json</code> and synced to the runtime preview.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DependenciesDialog;
