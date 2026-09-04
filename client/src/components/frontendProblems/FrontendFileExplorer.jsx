import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  FolderPlus,
  Pencil,
  Trash2,
} from "lucide-react";

const FrontendFileExplorer = ({
  files,
  activeFileId,
  onSelectFile,
  onToggleFolder,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
}) => {
  const renderTree = (items, depth = 0) => {
    return items.map((item) => {
      const isActive = item.id === activeFileId;
      const paddingLeft = 10 + depth * 16;

      /* =====================================================
         FOLDER
      ====================================================== */

      if (item.type === "folder") {
        return (
          <div key={item.id}>
            {/* Folder row */}
            <div
              className="group flex items-center rounded-md text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
              style={{
                paddingLeft,
              }}
            >
              {/* Folder name */}
              <button
                type="button"
                onClick={() => onToggleFolder(item.id)}
                className="flex min-w-0 flex-1 items-center gap-1 py-1.5 text-left text-sm"
              >
                {/* Expand / collapse */}
                {item.open ? (
                  <ChevronDown
                    size={14}
                    className="shrink-0"
                  />
                ) : (
                  <ChevronRight
                    size={14}
                    className="shrink-0"
                  />
                )}

                {/* Folder icon */}
                {item.open ? (
                  <FolderOpen
                    size={15}
                    className="shrink-0"
                  />
                ) : (
                  <Folder
                    size={15}
                    className="shrink-0"
                  />
                )}

                {/* Folder name */}
                <span className="truncate">
                  {item.name}
                </span>
              </button>

              {/* Folder actions */}
              <div className="mr-1 hidden items-center gap-1 group-hover:flex">
                {/* New File */}
                <button
                  type="button"
                  title="New File"
                  onClick={() => onCreateFile(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <Plus size={12} />
                </button>

                {/* New Folder */}
                <button
                  type="button"
                  title="New Folder"
                  onClick={() => onCreateFolder(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <FolderPlus size={12} />
                </button>

                {/* Rename Folder */}
                <button
                  type="button"
                  title="Rename"
                  onClick={() => onRenameFile(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <Pencil size={12} />
                </button>

                {/* Delete Folder */}
                <button
                  type="button"
                  title="Delete"
                  onClick={() => onDeleteFile(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Folder children */}
            {item.open &&
              item.children &&
              item.children.length > 0 && (
                <div>
                  {renderTree(item.children, depth + 1)}
                </div>
              )}
          </div>
        );
      }

      /* =====================================================
         FILE
      ====================================================== */

      return (
        <div
          key={item.id}
          className={`group flex items-center rounded-md transition ${
            isActive
              ? "bg-violet-500/15 text-violet-300"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          }`}
          style={{
            paddingLeft,
          }}
        >
          {/* File name */}
          <button
            type="button"
            onClick={() => onSelectFile(item.id)}
            className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm"
          >
            {/* File icon */}
            {item.language === "css" ||
            item.language === "html" ? (
              <FileText
                size={15}
                className="shrink-0"
              />
            ) : (
              <FileCode2
                size={15}
                className="shrink-0"
              />
            )}

            {/* File name */}
            <span className="truncate">
              {item.name}
            </span>
          </button>

          {/* File actions */}
          <div className="mr-1 hidden items-center gap-1 group-hover:flex">
            {/* Rename */}
            <button
              type="button"
              title="Rename"
              onClick={() => onRenameFile(item.id)}
              className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-white/10 hover:text-white"
            >
              <Pencil size={12} />
            </button>

            {/* Delete */}
            <button
              type="button"
              title="Delete"
              onClick={() => onDeleteFile(item.id)}
              className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-zinc-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex h-10 items-center justify-between border-b border-white/10 px-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Explorer
        </span>

        <div className="flex items-center gap-1">
          {/* Root New File */}
          <button
            type="button"
            onClick={() => onCreateFile(null)}
            title="New File"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <Plus size={15} />
          </button>

          {/* Root New Folder */}
          <button
            type="button"
            onClick={() => onCreateFolder(null)}
            title="New Folder"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <FolderPlus size={15} />
          </button>
        </div>
      </div>

      {/* =====================================================
          FILE TREE
      ====================================================== */}

      <div className="flex-1 overflow-y-auto p-2">
        {files && files.length > 0 ? (
          renderTree(files)
        ) : (
          <div className="flex h-32 items-center justify-center px-4 text-center text-xs text-zinc-600">
            No files yet.
          </div>
        )}
      </div>
    </aside>
  );
};

export default FrontendFileExplorer;