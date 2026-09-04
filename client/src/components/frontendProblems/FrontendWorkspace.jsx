import { useState } from "react";

import FrontendCodeEditor from "./FrontendCodeEditor";
import FrontendConsole from "./FrontendConsole";
import FrontendFileExplorer from "./FrontendFileExplorer";
import FrontendPreview from "./FrontendPreview";
import FrontendToolbar from "./FrontendToolbar";

/* =========================================================
   INITIAL FILE TREE
========================================================= */

const initialFiles = [
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
    <div style={{ padding: "40px" }}>
      <h1>Hello DevPilot 🚀</h1>

      <p>
        Your frontend application is running.
      </p>

      <Button />
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
const root = window.__devpilot_root || (window.__devpilot_root = createRoot(rootElement));

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
        content: `body {
  margin: 0;
  font-family: Arial, sans-serif;
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
      style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
      onClick={() => {
        console.log("Button clicked");
      }}
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
   FIND ITEM RECURSIVELY
========================================================= */

const findItemById = (items, id) => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }

    if (item.type === "folder" && item.children) {
      const found = findItemById(item.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

/* =========================================================
   UPDATE ITEM RECURSIVELY
========================================================= */

const updateItemById = (items, id, updater) => {
  return items.map((item) => {
    if (item.id === id) {
      return updater(item);
    }

    if (item.type === "folder" && item.children) {
      return {
        ...item,
        children: updateItemById(item.children, id, updater),
      };
    }

    return item;
  });
};

/* =========================================================
   REMOVE ITEM RECURSIVELY
========================================================= */

const removeItemById = (items, id) => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.type === "folder" && item.children) {
        return {
          ...item,
          children: removeItemById(item.children, id),
        };
      }

      return item;
    });
};

/* =========================================================
   COMPONENT
========================================================= */

const FrontendWorkspace = () => {
  const [files, setFiles] = useState(initialFiles);

  const [activeFileId, setActiveFileId] = useState("app-jsx");

  const [consoleOutput, setConsoleOutput] = useState([]);

  const [isRunning, setIsRunning] = useState(false);

  /* =======================================================
     FIND ACTIVE FILE
  ======================================================= */

  const activeFile = findItemById(files, activeFileId);

  /* =======================================================
     SELECT FILE
  ======================================================= */

  const handleFileSelect = (fileId) => {
    console.log("Selected file:", fileId);

    const selectedItem = findItemById(files, fileId);

    console.log("Selected item:", selectedItem);

    if (!selectedItem) {
      console.warn("File not found:", fileId);
      return;
    }

    // Do not allow folders to become active files
    if (selectedItem.type !== "file") {
      return;
    }

    setActiveFileId(fileId);
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
    } else if (extension === "jsx") {
      language = "javascript";
    }

    const newFile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      name: cleanName,

      type: "file",

      language,

      content: "",
    };

    /* Root file */
    if (!parentFolderId) {
      setFiles((currentFiles) => [...currentFiles, newFile]);
    } else {
      /* File inside folder */
      setFiles((currentFiles) =>
        updateItemById(currentFiles, parentFolderId, (folder) => ({
          ...folder,

          open: true,

          children: [...(folder.children || []), newFile],
        })),
      );
    }

    // Immediately open the new file
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

    /* Root folder */
    if (!parentFolderId) {
      setFiles((currentFiles) => [...currentFiles, newFolder]);
    } else {
      /* Folder inside another folder */
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
     RENAME FILE / FOLDER
  ======================================================= */

  const handleRenameFile = (itemId) => {
    const item = findItemById(files, itemId);

    if (!item) {
      console.warn("Item not found:", itemId);
      return;
    }

    const newName = window.prompt(`Rename "${item.name}" to:`, item.name);

    if (!newName || !newName.trim()) {
      return;
    }

    const cleanName = newName.trim();

    setFiles((currentFiles) =>
      updateItemById(currentFiles, itemId, (currentItem) => ({
        ...currentItem,
        name: cleanName,
      })),
    );
  };

  /* =======================================================
     DELETE FILE / FOLDER
  ======================================================= */

  const handleDeleteFile = (itemId) => {
    const item = findItemById(files, itemId);

    if (!item) {
      console.warn("Item not found:", itemId);
      return;
    }

    const confirmed = window.confirm(`Delete "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    setFiles((currentFiles) => removeItemById(currentFiles, itemId));

    /* If deleting active file */
    if (activeFileId === itemId) {
      setActiveFileId(null);
    }
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleConsoleMessage = (log) => {
    setConsoleOutput((prev) => [...prev.slice(-49), log]);
  };

  /* =======================================================
     RUN
  ======================================================= */

  const handleRun = () => {
    setIsRunning(true);
    setRefreshKey((prev) => prev + 1);

    setConsoleOutput((prev) => [
      ...prev,
      {
        type: "info",
        message: "Compiling and executing frontend preview...",
      },
    ]);

    setTimeout(() => {
      setIsRunning(false);
    }, 400);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    setFiles(JSON.parse(JSON.stringify(initialFiles)));

    setActiveFileId("app-jsx");

    setConsoleOutput([]);

    setIsRunning(false);

    setRefreshKey((prev) => prev + 1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <FrontendToolbar
        onRun={handleRun}
        onReset={handleReset}
        isRunning={isRunning}
      />

      {/* =================================================
          WORKSPACE
      ================================================= */}

      <div className="flex min-h-0 flex-1">
        {/* ===============================================
            FILE EXPLORER
        =============================================== */}

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

        {/* ===============================================
            EDITOR + CONSOLE
        =============================================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Editor */}
          <div className="min-h-0 flex-1">
            <FrontendCodeEditor
              file={
                activeFile && activeFile.type === "file" ? activeFile : null
              }
              onChange={handleFileChange}
            />
          </div>

          {/* Console */}
          <FrontendConsole output={consoleOutput} />
        </div>

        {/* ===============================================
            PREVIEW
        =============================================== */}

        <FrontendPreview
          files={files}
          refreshKey={refreshKey}
          onConsoleMessage={handleConsoleMessage}
        />
      </div>
    </div>
  );
};

export default FrontendWorkspace;

