import { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";

import { Monitor, RotateCcw } from "lucide-react";

/**
 * Synchronizes external file tree edits directly into the Sandpack bundler runtime
 * and executes manual preview refreshes without breaking layout or unmounting.
 */
const SandpackSyncController = ({
  files,
  manualRefreshKey,
  onStatusChange,
  onForceRemount,
}) => {
  const { sandpack } = useSandpack();
  const { refresh } = useSandpackNavigation();

  // Manual refresh handling
  useEffect(() => {
    if (manualRefreshKey > 0) {
      if (typeof refresh === "function") {
        try {
          refresh();
        } catch (e) {
          console.warn("Sandpack refresh failed, falling back to remount", e);
          onForceRemount?.();
        }
      } else if (sandpack && typeof sandpack.runSandpack === "function") {
        sandpack.runSandpack();
      } else {
        onForceRemount?.();
      }
    }
  }, [manualRefreshKey, refresh, sandpack, onForceRemount]);

  // Auto-synchronize file changes from Monaco / workspace to Sandpack
  useEffect(() => {
    if (!sandpack) return;

    const currentFiles = sandpack.files || {};
    const changedEntries = [];

    Object.entries(files).forEach(([filePath, fileObj]) => {
      const code = typeof fileObj === "string" ? fileObj : fileObj?.code;
      const currentCode = currentFiles[filePath]?.code;
      if (currentCode !== code) {
        changedEntries.push([filePath, code]);
      }
    });

    // Check for deleted files
    const removedPaths = [];
    Object.keys(currentFiles).forEach((filePath) => {
      if (
        filePath === "/index.js" ||
        filePath === "/App.js" ||
        filePath === "/public/index.html"
      ) {
        return;
      }
      if (!files[filePath]) {
        removedPaths.push(filePath);
      }
    });

    if (changedEntries.length === 0 && removedPaths.length === 0) {
      return;
    }

    onStatusChange?.("syncing");

    const timer = setTimeout(() => {
      // 1. Update Sandpack internal files registry
      changedEntries.forEach(([filePath, code]) => {
        if (currentFiles[filePath] !== undefined) {
          sandpack.updateFile(filePath, code ?? "", true);
        } else {
          sandpack.addFile(filePath, code ?? "", true);
        }
      });

      removedPaths.forEach((filePath) => {
        if (typeof sandpack.deleteFile === "function") {
          sandpack.deleteFile(filePath, true);
        }
      });

      // 2. Dispatch updated files directly to active clients for instant re-bundling
      if (sandpack.clients) {
        Object.values(sandpack.clients).forEach((client) => {
          if (client && typeof client.updateSandbox === "function") {
            try {
              client.updateSandbox({
                files,
              });
            } catch (err) {
              console.warn("Client sandbox update error:", err);
            }
          }
        });
      }

      onStatusChange?.("live");
    }, 250);

    return () => clearTimeout(timer);
  }, [files, sandpack, onStatusChange]);

  return null;
};

const FrontendPreview = ({ files, refreshKey, onConsoleMessage }) => {
  const [manualRefreshKey, setManualRefreshKey] = useState(0);
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [syncStatus, setSyncStatus] = useState("live");

  const handleManualRefresh = () => {
    setSyncStatus("refreshing");
    setManualRefreshKey((k) => k + 1);
    setTimeout(() => {
      setSyncStatus("live");
    }, 500);
  };

  /* =====================================================
     FORWARD SANDPACK CONSOLE LOGS TO DEVPIPLT CONSOLE
  ====================================================== */

  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (
        event.data &&
        event.data.codesandbox &&
        event.data.type === "console"
      ) {
        const rawLogs = Array.isArray(event.data.log)
          ? event.data.log
          : [event.data.log];

        rawLogs.forEach((item) => {
          let text = "";
          if (typeof item === "string") {
            text = item;
          } else if (item && Array.isArray(item.data)) {
            text = item.data
              .map((d) => (typeof d === "object" ? JSON.stringify(d) : String(d)))
              .join(" ");
          } else if (item) {
            text = JSON.stringify(item);
          }

          if (text && onConsoleMessage) {
            onConsoleMessage({
              type: item?.method || "log",
              message: text,
            });
          }
        });
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, [onConsoleMessage]);
  /* =====================================================
     CONVERT OUR FILE TREE INTO SANDPACK FILES
  ====================================================== */

  const collectFiles = (
    items,
    currentPath = ""
  ) => {
    const result = {};

    items.forEach((item) => {
      /* ================= FOLDER ================= */

      if (item.type === "folder") {
        const folderPath = currentPath
          ? `${currentPath}/${item.name}`
          : item.name;

        if (item.children) {
          Object.assign(
            result,
            collectFiles(
              item.children,
              folderPath
            )
          );
        }

        return;
      }

      /* ================= FILE ================= */

      const filePath = currentPath
        ? `${currentPath}/${item.name}`
        : item.name;

      result[`/${filePath}`] = {
        code: item.content || "",
      };
    });

    return result;
  };

  const userFiles = collectFiles(files);

  const filesSignature = Object.entries(userFiles)
    .map(([path, file]) => `${path}:${file.code.length}:${file.code.slice(0, 15)}`)
    .join(";");
  const revComment = `/* rev: ${filesSignature} */\n`;

  /* =====================================================
     DETECT ENTRY POINTS & GENERATE COMPATIBILITY BRIDGES
  ====================================================== */

  const hasSrcMain = Boolean(userFiles["/src/main.jsx"] || userFiles["/src/main.js"]);
  const hasSrcIndex = Boolean(userFiles["/src/index.jsx"] || userFiles["/src/index.js"]);
  const hasRootMain = Boolean(userFiles["/main.jsx"] || userFiles["/main.js"]);
  const hasRootIndex = Boolean(userFiles["/index.jsx"] || userFiles["/index.js"]);
  const hasSrcApp = Boolean(userFiles["/src/App.jsx"] || userFiles["/src/App.js"]);
  const hasRootApp = Boolean(userFiles["/App.jsx"] || userFiles["/App.js"]);

  let entryCode = `
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
if (!container.id) container.id = "root";

const root = window.__devpilot_root || (window.__devpilot_root = createRoot(container));
root.render(
  <StrictMode>
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>DevPilot Frontend Workspace</h2>
      <p>Create an App.jsx or main.jsx to begin.</p>
    </div>
  </StrictMode>
);
`;

  if (hasSrcMain) {
    entryCode = `${revComment}import "./src/main";`;
  } else if (hasSrcIndex) {
    entryCode = `${revComment}import "./src/index";`;
  } else if (hasRootMain) {
    entryCode = `${revComment}import "./main";`;
  } else if (hasRootIndex) {
    entryCode = `${revComment}${userFiles["/index.jsx"]?.code || userFiles["/index.js"]?.code || 'import "./App";'}`;
  } else if (hasSrcApp) {
    entryCode = `${revComment}
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";

const container = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
if (!container.id) container.id = "root";

const root = window.__devpilot_root || (window.__devpilot_root = createRoot(container));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
  } else if (hasRootApp) {
    entryCode = `${revComment}
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
if (!container.id) container.id = "root";

const root = window.__devpilot_root || (window.__devpilot_root = createRoot(container));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
  }

  const appBridgeCode = hasSrcApp
    ? `export { default } from "./src/App";`
    : hasRootApp
      ? userFiles["/App.jsx"]?.code || userFiles["/App.js"]?.code || `export default function App() { return null; }`
      : `export default function App() { return null; }`;

  const sandboxFiles = {
    ...userFiles,
    "/index.js": {
      code: entryCode,
      hidden: true,
    },
    "/App.js": {
      code: appBridgeCode,
      hidden: true,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevPilot</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
      hidden: true,
    },
  };

  return (
    <section className="flex w-[45%] min-w-[350px] flex-col border-l border-white/10 bg-zinc-900">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex h-10 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <Monitor
            size={15}
            className="text-zinc-500"
          />

          <span className="text-xs font-medium text-zinc-400">
            Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {syncStatus === "syncing" ? (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              Syncing...
            </div>
          ) : syncStatus === "refreshing" ? (
            <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
              <RotateCcw size={10} className="animate-spin text-violet-400" />
              Refreshing...
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          )}

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={syncStatus === "refreshing"}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white active:scale-95 disabled:opacity-50"
            title="Refresh preview"
          >
            <RotateCcw size={12} className={syncStatus === "refreshing" ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* =================================================
          SANDPACK PREVIEW
      ================================================== */}

      <div className="relative flex min-h-0 flex-1 flex-col bg-white">
        <style>{`
          .sp-loading,
          .sp-overlay.sp-loading {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          .sp-preview,
          .sp-preview-container,
          .sp-preview-iframe {
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            flex: 1 1 0% !important;
          }
        `}</style>
        <SandpackProvider
          key={`${refreshKey}-${forceRemountKey}`}
          template="react"
          files={sandboxFiles}
          customSetup={{
            entry: "/index.js",
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
            },
          }}
          options={{
            autorun: true,
            recompileMode: "delayed",
            recompileDelay: 300,
          }}
          className="flex h-full flex-1 flex-col"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <SandpackSyncController
            files={sandboxFiles}
            manualRefreshKey={manualRefreshKey}
            onStatusChange={setSyncStatus}
            onForceRemount={() => setForceRemountKey((k) => k + 1)}
          />

          <SandpackPreview
            showNavigator={false}
            showRefreshButton={true}
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={true}
            showOpenNewtab={false}
            showRestartButton={false}
            className="h-full flex-1"
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </SandpackProvider>
      </div>
    </section>
  );
};

export default FrontendPreview;