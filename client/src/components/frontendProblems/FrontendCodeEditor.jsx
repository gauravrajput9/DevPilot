import Editor from "@monaco-editor/react";

const FrontendCodeEditor = ({
  file,
  onChange,
}) => {
  if (!file) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950 text-sm text-zinc-500">
        Select a file
      </div>
    );
  }

  
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={file.language}
      value={file.content}
      onChange={(value) => onChange(value ?? "")}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        padding: {
          top: 12,
        },
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default FrontendCodeEditor;