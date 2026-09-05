import { useState, useMemo } from "react";

import DependenciesDialog from "./DependenciesDialog";
import FrontendCodeEditor from "./FrontendCodeEditor";
import FrontendConsole from "./FrontendConsole";
import FrontendFileExplorer from "./FrontendFileExplorer";
import FrontendFileNavigation from "./FrontendFileNavigation";
import FrontendPreview from "./FrontendPreview";
import FrontendToolbar from "./FrontendToolbar";

/* =========================================================
   INITIAL FILE TREE
========================================================= */

const initialFiles = [
  {
    id: "package-json",
    name: "package.json",
    type: "file",
    language: "json",
    content: JSON.stringify(
      {
        name: "devpilot-project",
        version: "1.0.0",
        private: true,
        dependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          "lucide-react": "^0.468.0",
          tailwindcss: "^3.4.17",
        },
        devDependencies: {},
      },
      null,
      2
    ),
  },

  {
    id: "src",
    name: "src",
    type: "folder",
    open: true,

    children: [
      {
        id: "app-jsx",
        name: "App.jsx",
        type: "file",
        language: "javascript",

        content: `import Button from "./components/Button";

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to DevPilot 🚀</h1>
      <p className="mt-2">Build, edit, and preview your frontend projects right here.</p>
    </div>
  );
}`,
      },

      {
        id: "main-jsx",
        name: "main.jsx",
        type: "file",
        language: "javascript",

        content: `import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

const root =
  window.__devpilot_root ||
  (window.__devpilot_root =
    createRoot(rootElement));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },

      {
        id: "index-css",
        name: "index.css",
        type: "file",
        language: "css",

        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background-color: #09090b;
  color: #fafafa;
}

* {
  box-sizing: border-box;
}`,
      },

      {
        id: "components",
        name: "components",
        type: "folder",
        open: true,

        children: [
          {
            id: "button-jsx",
            name: "Button.jsx",
            type: "file",
            language: "javascript",

            content: `export default function Button() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("Button clicked!");
      }}
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
    >
      Click Me
    </button>
  );
}`,
          },
        ],
      },
    ],
  },
];

/* =========================================================
   FIND ITEM BY ID
========================================================= */

const findItemById = (items, id) => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }

    if (item.type === "folder" && Array.isArray(item.children)) {
      const found = findItemById(item.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

/* =========================================================
   UPDATE ITEM BY ID
========================================================= */

const updateItemById = (items, id, updater) => {
  return items.map((item) => {
    if (item.id === id) {
      return updater(item);
    }

    if (item.type === "folder" && Array.isArray(item.children)) {
      return {
        ...item,

        children: updateItemById(item.children, id, updater),
      };
    }

    return item;
  });
};

/* =========================================================
   REMOVE ITEM BY ID
========================================================= */

const removeItemById = (items, id) => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.type === "folder" && Array.isArray(item.children)) {
        return {
          ...item,

          children: removeItemById(item.children, id),
        };
      }

      return item;
    });
};

/* =========================================================
   PARSE PACKAGE.JSON FROM FILE TREE
========================================================= */

const getPackageJsonFromFiles = (currentFiles) => {
  const pkgFile = currentFiles.find(
    (f) => f.name === "package.json" && f.type === "file"
  );
  if (pkgFile && pkgFile.content) {
    try {
      const parsed = JSON.parse(pkgFile.content);
      if (
        parsed &&
        typeof parsed.dependencies === "object" &&
        parsed.dependencies !== null
      ) {
        return parsed;
      }
    } catch (err) {
      console.warn("DevPilot: Failed to parse package.json from files", err);
    }
  }
  return {
    name: "devpilot-project",
    version: "1.0.0",
    private: true,
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      "lucide-react": "^0.468.0",
    },
    devDependencies: {},
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const FrontendWorkspace = () => {
  const [files, setFiles] = useState(initialFiles);

  const [openFileIds, setOpenFileIds] = useState([
    "app-jsx",
    "main-jsx",
    "index-css",
    "button-jsx",
    "package-json",
  ]);

  const [activeFileId, setActiveFileId] = useState("app-jsx");

  const [consoleOutput, setConsoleOutput] = useState([]);

  const [isRunning, setIsRunning] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);

  /* =======================================================
     DERIVED PACKAGE CONFIGURATION & DEPENDENCIES
  ======================================================= */

  const currentPackageJson = useMemo(
    () => getPackageJsonFromFiles(files),
    [files]
  );

  const dependencies = useMemo(
    () => currentPackageJson.dependencies || {},
    [currentPackageJson]
  );

  const dependencyCount = Object.keys(dependencies).length;

  /* =======================================================
     ADD DEPENDENCY
  ======================================================= */

  const handleAddDependency = (pkgName, pkgVersion = "latest") => {
    setFiles((currentFiles) => {
      const pkg = getPackageJsonFromFiles(currentFiles);
      const updatedDependencies = {
        ...pkg.dependencies,
        [pkgName]: pkgVersion,
      };
      const updatedPkg = {
        ...pkg,
        dependencies: updatedDependencies,
      };
      const newContent = JSON.stringify(updatedPkg, null, 2);

      const pkgFile = currentFiles.find(
        (f) => f.name === "package.json" && f.type === "file"
      );

      if (pkgFile) {
        return updateItemById(currentFiles, pkgFile.id, (item) => ({
          ...item,
          content: newContent,
        }));
      }

      return [
        {
          id: "package-json",
          name: "package.json",
          type: "file",
          language: "json",
          content: newContent,
        },
        ...currentFiles,
      ];
    });

    setRefreshKey((prev) => prev + 1);
  };

  /* =======================================================
     REMOVE DEPENDENCY
  ======================================================= */

  const handleRemoveDependency = (pkgName) => {
    setFiles((currentFiles) => {
      const pkg = getPackageJsonFromFiles(currentFiles);
      if (!pkg.dependencies || !pkg.dependencies[pkgName]) {
        return currentFiles;
      }

      const remainingDependencies = { ...pkg.dependencies };
      delete remainingDependencies[pkgName];
      const updatedPkg = {
        ...pkg,
        dependencies: remainingDependencies,
      };
      const newContent = JSON.stringify(updatedPkg, null, 2);

      const pkgFile = currentFiles.find(
        (f) => f.name === "package.json" && f.type === "file"
      );

      if (pkgFile) {
        return updateItemById(currentFiles, pkgFile.id, (item) => ({
          ...item,
          content: newContent,
        }));
      }

      return currentFiles;
    });

    setRefreshKey((prev) => prev + 1);
  };

  /* =======================================================
     ACTIVE FILE
  ======================================================= */

  const activeFile = findItemById(files, activeFileId);

  /* =======================================================
     SELECT FILE
  ======================================================= */

  const handleFileSelect = (fileId) => {
    const selectedItem = findItemById(files, fileId);

    if (!selectedItem) {
      console.warn("File not found:", fileId);

      return;
    }

    if (selectedItem.type !== "file") {
      return;
    }

    setOpenFileIds((prev) =>
      prev.includes(fileId) ? prev : [...prev, fileId]
    );

    setActiveFileId(fileId);
  };

  /* =======================================================
     CLOSE FILE TAB
  ======================================================= */

  const handleCloseFile = (fileId) => {
    setOpenFileIds((prev) => {
      const next = prev.filter((id) => id !== fileId);

      if (activeFileId === fileId) {
        if (next.length > 0) {
          const closedIndex = prev.indexOf(fileId);
          const nextActive = next[Math.min(closedIndex, next.length - 1)];
          setActiveFileId(nextActive);
        } else {
          setActiveFileId(null);
        }
      }

      return next;
    });
  };

  /* =======================================================
     EDIT FILE
  ======================================================= */

  const handleFileChange = (value) => {
    if (!activeFileId) {
      return;
    }

    setFiles((currentFiles) =>
      updateItemById(currentFiles, activeFileId, (item) => ({
        ...item,
        content: value,
      })),
    );
  };

  /* =======================================================
     TOGGLE FOLDER
  ======================================================= */

  const handleToggleFolder = (folderId) => {
    setFiles((currentFiles) =>
      updateItemById(currentFiles, folderId, (folder) => ({
        ...folder,
        open: !folder.open,
      })),
    );
  };

  /* =======================================================
     CREATE FILE
  ======================================================= */

  const handleCreateFile = (parentFolderId = null) => {
    const name = window.prompt("Enter file name:");

    if (!name || !name.trim()) {
      return;
    }

    const cleanName = name.trim();

    const extension = cleanName.split(".").pop().toLowerCase();

    let language = "javascript";

    if (extension === "css") {
      language = "css";
    } else if (extension === "html") {
      language = "html";
    } else if (extension === "json") {
      language = "json";
    }

    const newFile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      name: cleanName,

      type: "file",

      language,

      content: "",
    };

    if (!parentFolderId) {
      setFiles((currentFiles) => [...currentFiles, newFile]);
    } else {
      setFiles((currentFiles) =>
        updateItemById(currentFiles, parentFolderId, (folder) => ({
          ...folder,

          open: true,

          children: [...(folder.children || []), newFile],
        })),
      );
    }

    setOpenFileIds((prev) => (prev.includes(newFile.id) ? prev : [...prev, newFile.id]));
    setActiveFileId(newFile.id);
  };

  /* =======================================================
     CREATE FOLDER
  ======================================================= */

  const handleCreateFolder = (parentFolderId = null) => {
    const name = window.prompt("Enter folder name:");

    if (!name || !name.trim()) {
      return;
    }

    const cleanName = name.trim();

    const newFolder = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      name: cleanName,

      type: "folder",

      open: true,

      children: [],
    };

    if (!parentFolderId) {
      setFiles((currentFiles) => [...currentFiles, newFolder]);
    } else {
      setFiles((currentFiles) =>
        updateItemById(currentFiles, parentFolderId, (folder) => ({
          ...folder,

          open: true,

          children: [...(folder.children || []), newFolder],
        })),
      );
    }
  };

  /* =======================================================
     RENAME
  ======================================================= */

  const handleRenameFile = (itemId) => {
    const item = findItemById(files, itemId);

    if (!item) {
      return;
    }

    const newName = window.prompt(`Rename "${item.name}" to:`, item.name);

    if (!newName || !newName.trim()) {
      return;
    }

    setFiles((currentFiles) =>
      updateItemById(currentFiles, itemId, (currentItem) => ({
        ...currentItem,

        name: newName.trim(),
      })),
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteFile = (itemId) => {
    const item = findItemById(files, itemId);

    if (!item) {
      return;
    }

    const confirmed = window.confirm(`Delete "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setFiles((currentFiles) => removeItemById(currentFiles, itemId));

    setOpenFileIds((prev) => prev.filter((id) => id !== itemId));

    if (activeFileId === itemId) {
      setActiveFileId(null);
    }
  };

  /* =======================================================
     CONSOLE
  ======================================================= */

  const handleConsoleMessage = (log) => {
    setConsoleOutput((previous) => [...previous.slice(-49), log]);
  };

  /* =======================================================
     RUN
  ======================================================= */

  const handleRun = () => {
    console.log("DevPilot: Run frontend application");

    setIsRunning(true);

    setConsoleOutput((previous) => [
      ...previous,

      {
        type: "info",
        message: "Running frontend application...",
      },
    ]);

    setRefreshKey((previous) => previous + 1);

    setTimeout(() => {
      setIsRunning(false);
    }, 600);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    console.log("DevPilot: Reset workspace");

    const resetFiles = JSON.parse(JSON.stringify(initialFiles));

    setFiles(resetFiles);

    setOpenFileIds(["app-jsx", "main-jsx", "index-css", "button-jsx", "package-json"]);

    setActiveFileId("app-jsx");

    setConsoleOutput([]);

    setIsRunning(false);

    setRefreshKey((previous) => previous + 1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/10
        bg-zinc-950
      "
    >
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="shrink-0">
        <FrontendToolbar
          onRun={handleRun}
          onReset={handleReset}
          isRunning={isRunning}
          onOpenDependencies={() => setIsDependenciesOpen(true)}
          dependencyCount={dependencyCount}
        />
      </div>

      {/* =================================================
          MAIN WORKSPACE
      ================================================= */}

      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        {/* =================================================
            FILE EXPLORER
        ================================================= */}

        <div
          className="
            h-full
            w-[240px]
            min-w-[200px]
            shrink-0
            overflow-hidden
            border-r
            border-white/10
          "
        >
          <FrontendFileExplorer
            files={files}
            activeFileId={activeFileId}
            onSelectFile={handleFileSelect}
            onToggleFolder={handleToggleFolder}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
          />
        </div>

        {/* =================================================
            EDITOR + CONSOLE
        ================================================= */}

        <div
          className="
            flex
            h-full
            min-w-0
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {/* ---------------------------------------------
              TOP FILE NAVIGATION (TABS + BREADCRUMBS)
          --------------------------------------------- */}

          <FrontendFileNavigation
            files={files}
            openFileIds={openFileIds}
            activeFileId={activeFileId}
            onSelectFile={handleFileSelect}
            onCloseFile={handleCloseFile}
            onCreateFile={handleCreateFile}
          />

          {/* ---------------------------------------------
              MONACO EDITOR
          --------------------------------------------- */}

          <div
            className="
              min-h-0
              flex-1
              overflow-hidden
            "
          >
            <FrontendCodeEditor
              file={
                activeFile && activeFile.type === "file" ? activeFile : null
              }
              files={files}
              dependencies={dependencies}
              onChange={handleFileChange}
            />
          </div>

          {/* ---------------------------------------------
              CONSOLE
          --------------------------------------------- */}

          <div
            className="
              h-[180px]
              min-h-[120px]
              max-h-[280px]
              shrink-0
              overflow-hidden
              border-t
              border-white/10
            "
          >
            <FrontendConsole output={consoleOutput} />
          </div>
        </div>

        {/* =================================================
            PREVIEW
        ================================================= */}

        <div
          className="
            h-full
            w-[42%]
            min-w-[360px]
            max-w-[700px]
            shrink-0
            overflow-hidden
            border-l
            border-white/10
            bg-zinc-950
          "
        >
          <FrontendPreview
            files={files}
            refreshKey={refreshKey}
            onConsoleMessage={handleConsoleMessage}
          />
        </div>
      </div>

      {/* =================================================
          DEPENDENCIES MODAL
      ================================================= */}

      <DependenciesDialog
        isOpen={isDependenciesOpen}
        onClose={() => setIsDependenciesOpen(false)}
        dependencies={dependencies}
        onAddDependency={handleAddDependency}
        onRemoveDependency={handleRemoveDependency}
      />
    </div>
  );
};

export default FrontendWorkspace;
