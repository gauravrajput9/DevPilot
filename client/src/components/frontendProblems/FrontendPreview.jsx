import { useEffect, useMemo, useState, useCallback } from "react";
import {
  SandpackProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { Monitor, RotateCcw } from "lucide-react";

/* =========================================================
   SYSTEM FILES THAT DEVPILOT CONTROLS
========================================================= */

const SYSTEM_FILE_PATHS = new Set([
  "/index.js",
  "/public/index.html",
]);

/* =========================================================
   PATH HELPERS
========================================================= */

const normalizePath = (path) => {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/").replace(/\/+/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

/* =========================================================
   FLATTEN FILE TREE
========================================================= */

const collectFiles = (items = [], parentPath = "", result = {}) => {
  for (const item of items) {
    if (!item?.name) continue;

    const currentPath = normalizePath(`${parentPath}/${item.name}`);

    if (item.type === "file") {
      result[currentPath] = item.content ?? "";
      continue;
    }

    if (item.type === "folder" && Array.isArray(item.children)) {
      collectFiles(item.children, currentPath, result);
    }
  }

  return result;
};

/* =========================================================
   FIND FIRST EXISTING FILE
========================================================= */

const findFirstFile = (files, candidates) => {
  return candidates.find((path) =>
    Object.prototype.hasOwnProperty.call(files, path)
  );
};

const createImportPathFromEntry = (path) => {
  return `.${path}`;
};

/* =========================================================
   CREATE ENTRY CODE
========================================================= */

const createEntryCode = (userFiles) => {
  const explicitEntry = findFirstFile(userFiles, [
    "/src/main.jsx",
    "/src/main.js",
    "/src/index.jsx",
    "/src/index.js",
    "/main.jsx",
    "/main.js",
    "/index.jsx",
    "/index.js",
  ]);

  if (explicitEntry) {
    return `import "${createImportPathFromEntry(explicitEntry)}";`;
  }

  const appFile = findFirstFile(userFiles, [
    "/src/App.jsx",
    "/src/App.js",
    "/App.jsx",
    "/App.js",
  ]);

  if (appFile) {
    return `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "${createImportPathFromEntry(appFile)}";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = window.__devpilot_root || createRoot(rootElement);
  window.__devpilot_root = root;

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
`;
  }

  return `
import React from "react";
import { createRoot } from "react-dom/client";

function EmptyPreview() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#09090b",
        color: "#a1a1aa",
        fontFamily: "Arial, sans-serif",
        padding: 24,
        textAlign: "center",
      }}
    >
      <section>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>
          DevPilot Frontend Editor
        </h2>
        <p>Create App.jsx or src/main.jsx to start the preview.</p>
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<EmptyPreview />);
}
`;
};

/* =========================================================
   EXTRACT DEPENDENCIES
========================================================= */

const extractDependencies = (userFiles) => {
  const defaultDeps = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "^5.0.1",
    "lucide-react": "latest",
    tailwindcss: "^3.4.17",
  };

  if (userFiles["/package.json"]) {
    try {
      const parsed = JSON.parse(userFiles["/package.json"]);
      if (
        parsed &&
        typeof parsed.dependencies === "object" &&
        parsed.dependencies !== null
      ) {
        return {
          ...defaultDeps,
          ...parsed.dependencies,
        };
      }
    } catch (error) {
      console.warn(
        "DevPilot: Failed to parse /package.json. Using fallback dependencies.",
        error
      );
    }
  }

  return defaultDeps;
};

/* =========================================================
   FILTER RUNTIME DEPENDENCIES FOR SANDPACK
   (Node-only build tools are handled via in-browser JIT to prevent bundler crashes)
========================================================= */

const NODE_BUILD_ONLY_PACKAGES = new Set([
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "@tailwindcss/vite",
  "@tailwindcss/postcss",
]);

const getSandpackRuntimeDependencies = (dependencies = {}) => {
  const runtimeDeps = {};
  Object.entries(dependencies).forEach(([pkg, version]) => {
    if (!NODE_BUILD_ONLY_PACKAGES.has(pkg)) {
      runtimeDeps[pkg] = version;
    }
  });
  return runtimeDeps;
};

/* =========================================================
   EXTRACT TAILWIND CONFIGURATION & STYLES
========================================================= */

const extractTailwindConfig = (userFiles) => {
  const configFile =
    userFiles["/tailwind.config.js"] ||
    userFiles["/tailwind.config.cjs"] ||
    userFiles["/tailwind.config.mjs"] ||
    userFiles["/src/tailwind.config.js"];

  if (!configFile) return "";

  try {
    const match = configFile.match(
      /(?:module\.exports\s*=|export\s+default)\s*(\{[\s\S]*\});?\s*$/
    );
    if (match && match[1]) {
      return `
    <script>
      try {
        window.tailwind = window.tailwind || {};
        const userCfg = ${match[1]};
        window.tailwind.config = {
          darkMode: "class",
          ...userCfg,
          theme: {
            extend: {},
            ...(userCfg.theme || {}),
            extend: {
              ...(userCfg.theme?.extend || {}),
            },
          },
        };
      } catch (err) {
        console.warn("DevPilot: Failed to evaluate tailwind.config.js", err);
      }
    </script>
`;
    }
  } catch {
    // ignore
  }

  return "";
};

/**
 * Extract CSS rules containing @tailwind or @apply to inject into <style type="text/tailwindcss">
 * so Tailwind Play CDN compiles them natively.
 */
const extractCustomTailwindStyles = (userFiles) => {
  let customCss = "";
  Object.entries(userFiles).forEach(([path, content]) => {
    if (
      path.endsWith(".css") &&
      content &&
      (content.includes("@apply") || content.includes("@tailwind"))
    ) {
      customCss += `\n/* Source: ${path} */\n${content}\n`;
    }
  });

  if (customCss) {
    return `<style type="text/tailwindcss">${customCss}</style>`;
  }

  return "";
};

/**
 * Sanitize CSS files passed into Sandpack's Webpack bundler.
 * Standard Webpack css-loader in react-scripts will crash on @tailwind or @apply.
 * We comment them out for Webpack because they are compiled via Tailwind Play CDN in <style type="text/tailwindcss">.
 */
const sanitizeCssForWebpack = (content = "") => {
  if (!content) return "";
  return content
    .replace(/@tailwind\s+[^;]+;/g, (match) => `/* ${match} */`)
    .replace(/@apply\s+[^;]+;/g, (match) => `/* ${match} */`);
};

/* =========================================================
   CREATE SANDBOX FILES
========================================================= */

const createSandboxFiles = (userFiles, dependencies) => {
  const sandboxFiles = {};

  /* Copy user files */
  Object.entries(userFiles).forEach(([path, content]) => {
    const normalizedPath = normalizePath(path);
    if (SYSTEM_FILE_PATHS.has(normalizedPath)) {
      return;
    }

    let code = content ?? "";
    if (normalizedPath.endsWith(".css")) {
      code = sanitizeCssForWebpack(code);
    }

    sandboxFiles[normalizedPath] = {
      code,
    };
  });

  /* Index entry */
  sandboxFiles["/index.js"] = {
    code: createEntryCode(userFiles),
    hidden: true,
  };

  /* HTML with Tailwind Play CDN */
  const tailwindConfigScript = extractTailwindConfig(userFiles);
  const tailwindCustomStyles = extractCustomTailwindStyles(userFiles);

  sandboxFiles["/public/index.html"] = {
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevPilot Preview</title>
    <!-- Tailwind CSS Browser JIT Runtime -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,container-queries"></script>
    <script>
      window.tailwind = window.tailwind || {};
      window.tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {},
        },
      };
    </script>
    ${tailwindConfigScript}
    ${tailwindCustomStyles}
  </head>
  <body class="min-h-screen bg-transparent antialiased">
    <div id="root"></div>
  </body>
</html>`,
    hidden: true,
  };

  /* package.json */
  sandboxFiles["/package.json"] = {
    code: JSON.stringify(
      {
        name: "devpilot-project",
        version: "1.0.0",
        private: true,
        scripts: {
          start: "react-scripts start",
          build: "react-scripts build",
        },
        dependencies,
        devDependencies: {},
      },
      null,
      2
    ),
    hidden: true,
  };

  return sandboxFiles;
};

/* =========================================================
   CREATE PREVIEW SIGNATURE
========================================================= */

const createFilesSignature = (
  userFiles,
  refreshKey,
  dependencies = {}
) => {
  const body = Object.entries(userFiles)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([path, content]) => `${path}:${content.length}:${content}`)
    .join("\n---devpilot-file---\n");

  const depsSignature = Object.entries(dependencies)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([pkg, version]) => `${pkg}@${version}`)
    .join(";");

  return `${refreshKey}:${depsSignature}:${body}`;
};

/* =========================================================
   DEBOUNCED VALUE
========================================================= */

const useDebouncedValue = (value, delay = 120) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

/* =========================================================
   FRONTEND PREVIEW COMPONENT
========================================================= */

const FrontendPreview = ({ files = [], refreshKey = 0 }) => {
  const [manualKey, setManualKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userFiles = useMemo(() => collectFiles(files), [files]);

  const dependencies = useMemo(
    () => extractDependencies(userFiles),
    [userFiles]
  );

  const sandpackDependencies = useMemo(
    () => getSandpackRuntimeDependencies(dependencies),
    [dependencies]
  );

  const livePreviewState = useMemo(
    () => ({
      userFiles,
      dependencies,
      sandpackDependencies,
      refreshKey: `${refreshKey}-${manualKey}`,
    }),
    [userFiles, dependencies, sandpackDependencies, refreshKey, manualKey]
  );

  const previewState = useDebouncedValue(livePreviewState);

  const previewSignature = useMemo(
    () =>
      createFilesSignature(
        previewState.userFiles,
        previewState.refreshKey,
        previewState.dependencies
      ),
    [previewState]
  );

  const sandboxFiles = useMemo(
    () =>
      createSandboxFiles(
        previewState.userFiles,
        previewState.dependencies
      ),
    [previewState]
  );

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    setManualKey((k) => k + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  return (
    <section className="flex h-full w-full flex-col bg-zinc-950 overflow-hidden">
      {/* =================================================
          PREVIEW HEADER TOOLBAR
      ================================================== */}
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-white/10 px-3 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Monitor size={14} className="text-violet-400" />
          <span className="text-xs font-semibold text-zinc-300 tracking-wide">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tailwind Active
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 rounded border border-white/10 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Reload preview"
          >
            <RotateCcw
              size={11}
              className={isRefreshing ? "animate-spin text-violet-400" : ""}
            />
            <span>Reload</span>
          </button>
        </div>
      </header>

      {/* =================================================
          SANDPACK PREVIEW IFRAME
      ================================================== */}
      <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden bg-zinc-950">
        <SandpackProvider
          key={previewSignature}
          template="react"
          files={sandboxFiles}
          customSetup={{
            entry: "/index.js",
            dependencies: previewState.sandpackDependencies,
          }}
          options={{
            autorun: true,
            autoReload: true,
            recompileMode: "immediate",
            initMode: "immediate",
            externalResources: [
              "https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,container-queries",
            ],
          }}
        >
          <div className="absolute inset-0 h-full w-full min-h-0 min-w-0 overflow-hidden">
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
              showOpenNewtab={false}
              showRefreshButton={false}
              showRestartButton={false}
              className="!absolute !inset-0 !m-0 !h-full !w-full"
              style={{
                height: "100%",
                width: "100%",
                minHeight: 0,
                minWidth: 0,
              }}
            />
          </div>
        </SandpackProvider>
      </div>
    </section>
  );
};

export default FrontendPreview;