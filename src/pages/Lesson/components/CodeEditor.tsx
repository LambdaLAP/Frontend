import React from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: OnMount;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  onMount,
}) => {
  return (
    <div className="h-full w-full border border-gray-200 rounded-md overflow-hidden bg-white">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={onMount}
        theme="light" // Using light theme as requested
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
