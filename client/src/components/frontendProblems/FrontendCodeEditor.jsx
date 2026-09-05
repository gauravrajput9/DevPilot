import { useEffect, useMemo, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  vsCodeEditorOptions,
  registerFrontendCompletions,
  syncDependenciesWithMonaco,
} from "../../utils/monacoSuggestions";

/* =========================================================
   PATH HELPERS (OUTSIDE COMPONENT)
========================================================= */

const normalizePath = (path = "") => {
  if (!path) return "";
  let normalized = path.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  return normalized;
};

const getFileExtension = (name = "") => {
  const parts = name.split(".");
  if (parts.length <= 1) {
    return "";
  }
  return parts.pop().toLowerCase();
};

/* =========================================================
   FLATTEN FILE TREE (OUTSIDE COMPONENT)
========================================================= */

const flattenFiles = (items = [], parentPath = "", result = []) => {
  for (const item of items) {
    if (!item?.name) continue;

    const currentPath = normalizePath(`${parentPath}/${item.name}`);

    if (item.type === "file") {
      result.push({
        ...item,
        path: currentPath,
        content: item.content ?? "",
      });
      continue;
    }

    if (item.type === "folder" && Array.isArray(item.children)) {
      flattenFiles(item.children, currentPath, result);
    }
  }

  return result;
};

/* =========================================================
   COMPONENT: FRONTEND CODE EDITOR
========================================================= */

const FrontendCodeEditor = ({
  file,
  files = [],
  dependencies = {},
  onChange,
}) => {
  const monacoRef = useRef(null);
  const completionProviderRef = useRef(null);

  const projectFilesRef = useRef([]);
  const currentFilePathRef = useRef("");
  const dependenciesRef = useRef(dependencies);

  /* =========================================================
     COMPUTED PROJECT FILES & PATHS (UNCONDITIONAL HOOKS)
  ========================================================= */

  const projectFiles = useMemo(() => {
    return flattenFiles(files);
  }, [files]);

  const currentProjectFile = useMemo(() => {
    if (!file) return null;

    if (file.path) {
      return projectFiles.find(
        (item) =>
          normalizePath(item.path) ===
          normalizePath(file.path)
      );
    }

    const matches = projectFiles.filter(
      (item) => item.name === file.name
    );

    if (matches.length === 1) {
      return matches[0];
    }

    const contentMatch = matches.find(
      (item) =>
        (item.content ?? "") ===
        (file.content ?? "")
    );

    return contentMatch || null;
  }, [file, projectFiles]);

  const currentFilePath = normalizePath(
    currentProjectFile?.path ||
      file?.path ||
      file?.name ||
      ""
  );

  /* Update refs in effect, not render */
  useEffect(() => {
    projectFilesRef.current = projectFiles;
    currentFilePathRef.current = currentFilePath;
    dependenciesRef.current = dependencies;
  }, [projectFiles, currentFilePath, dependencies]);

  /* =========================================================
     SYNCHRONIZE PROJECT MODELS WITH MONACO
  ========================================================= */

  const syncProjectModels = useCallback((monaco, pFiles) => {
    if (!monaco) return;

    pFiles.forEach((projectFile) => {
      const path = normalizePath(projectFile.path);
      if (!path) return;

      const uri = monaco.Uri.parse(`file://${path}`);
      const model = monaco.editor.getModel(uri);
      const ext = getFileExtension(projectFile.name);
      const lang =
        ext === "jsx" || ext === "js"
          ? "javascript"
          : ext === "css"
          ? "css"
          : ext === "html"
          ? "html"
          : ext === "json"
          ? "json"
          : undefined;

      if (!model) {
        monaco.editor.createModel(
          projectFile.content ?? "",
          lang,
          uri
        );
      } else if (model.getValue() !== (projectFile.content ?? "")) {
        model.setValue(projectFile.content ?? "");
      }
    });
  }, []);

  /* =========================================================
     MONACO LANGUAGE
  ========================================================= */

  const getMonacoLanguage = () => {
    if (!file) return "javascript";
    const extension = getFileExtension(
      file.name || currentFilePath
    );

    switch (extension) {
      case "jsx":
      case "js":
        return "javascript";
      case "tsx":
      case "ts":
        return "typescript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      default:
        return file.language || "javascript";
    }
  };

  /* =========================================================
     EDITOR WILL MOUNT (REGISTER INTELLISENSE)
  ========================================================= */

  const handleEditorWillMount = (monaco) => {
    monacoRef.current = monaco;

    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    completionProviderRef.current = registerFrontendCompletions(
      monaco,
      () => projectFilesRef.current,
      () => currentFilePathRef.current,
      () => dependenciesRef.current
    );
  };

  /* =========================================================
     EDITOR DID MOUNT
  ========================================================= */

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    syncProjectModels(monaco, projectFilesRef.current);
    syncDependenciesWithMonaco(monaco, dependenciesRef.current);
  };

  /* Keep models in sync when files change */
  useEffect(() => {
    const monaco = monacoRef.current;
    if (monaco) {
      syncProjectModels(monaco, projectFiles);
    }
  }, [projectFiles, syncProjectModels]);

  /* Keep dependencies in sync with Monaco extraLibs */
  useEffect(() => {
    const monaco = monacoRef.current;
    if (monaco) {
      syncDependenciesWithMonaco(monaco, dependencies);
    }
  }, [dependencies]);

  /* Cleanup completion provider on unmount */
  useEffect(() => {
    return () => {
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
      }
    };
  }, []);

  /* =========================================================
     EMPTY STATE (IF NO FILE ACTIVE)
  ========================================================= */

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        <p className="mb-1 text-zinc-400 font-medium">No open files</p>
        <p className="text-xs text-zinc-600">
          Select a file from the explorer or create a new file to start coding
        </p>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="h-full w-full min-h-0 min-w-0 overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        path={`file://${currentFilePath}`}
        language={getMonacoLanguage()}
        value={file.content ?? ""}
        onChange={(value) => {
          onChange(value ?? "");
        }}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={vsCodeEditorOptions}
      />
    </div>
  );
};

export default FrontendCodeEditor;