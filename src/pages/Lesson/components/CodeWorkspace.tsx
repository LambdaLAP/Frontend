import React, { useState } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import { Play, Send } from "lucide-react";
import Button from "../../../components/ui/Button";
import { type CodeExecutionPayload, lessonService } from "../../../services/lessonService";
import { type Challenge, type ExecutionResult } from "../../../types/api";

interface CodeWorkspaceProps {
  initialCode: string;
  language?: string;
  challengeId?: string;
  challenge?: Challenge;
}

const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  initialCode,
  language = "python",
  challengeId,
  challenge,
}) => {
  const [code, setCode] = useState(initialCode);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setExecutionResult(null);
    try {
      const payload: CodeExecutionPayload = {
        challengeId,
        code,
        language: language === "python" ? "python" : language, // Normalize or map languages if needed
      };
      const result = await lessonService.runCode(payload);
      setExecutionResult(result);
    } catch (error) {
      console.error("Execution error:", error);
      setExecutionResult({
        status: "ERROR",
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown error occurred",
        metrics: { runtime: "0s" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!challengeId) {
      // If no challenge, we can't really "submit" a solution in the persistent sense
      // Fallback to running or show error
      await handleRun();
      return;
    }

    setIsLoading(true);
    setExecutionResult(null);
    try {
      const payload = {
        challengeId,
        code,
        language: language === "python" ? "python" : language,
      };
      
      const result = await lessonService.submitCode(payload);
      setExecutionResult(result);
      
      if (result.status === "PASSED") {
          // Could add toast or confetti here
          console.log("Submission successful", result.submissionId);
      }

    } catch (error) {
      console.error("Submission error:", error);
      setExecutionResult({
        status: "ERROR",
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown error occurred",
        metrics: { runtime: "0s" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Toolkit / Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded capitalize">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Editor & Output Split */}
      <div className="flex-1 h-full min-h-0">
        <PanelGroup orientation="vertical">
          <Panel defaultSize={70} minSize={20}>
            <CodeEditor
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
            />
          </Panel>
          <PanelResizeHandle className="h-2 bg-gray-100 border-y border-gray-200 hover:bg-blue-50 transition-colors flex items-center justify-center cursor-row-resize">
             <div className="w-8 h-1 bg-gray-300 rounded-full" />
          </PanelResizeHandle>
          <Panel defaultSize={30} minSize={20}>
            <OutputPanel 
                executionResult={executionResult} 
                isLoading={isLoading}
                testCases={challenge?.testCases} 
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CodeWorkspace;
