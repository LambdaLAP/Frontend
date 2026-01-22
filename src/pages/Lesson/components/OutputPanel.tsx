import React from "react";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";
import { type ExecutionResult, type TestCase } from "../../../types/api";

interface OutputPanelProps {
  executionResult: ExecutionResult | null;
  testCases: TestCase[] | undefined;
  isLoading?: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  executionResult,
  testCases,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Running execution...
      </div>
    );
  }

  if (!executionResult && !testCases) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
        <Terminal className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">Run your code to see the output here.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Console</span>
        </div>
        {executionResult && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
             <span>Runtime: {executionResult.metrics.runtime}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {executionResult ? (
          <div>
            <div className={`mb-4 whitespace-pre-wrap ${executionResult.status === 'ERROR' ? 'text-red-600' : 'text-gray-800'}`}>
              {executionResult.status === 'ERROR' && executionResult.stderr ? executionResult.stderr : executionResult.stdout}
            </div>
            
            {/* Test Case Visualization (if applicable) */}
            {testCases && testCases.length > 0 && (
                 <div className="mt-4 border-t pt-4">
                    <h4 className="text-gray-600 font-semibold mb-2">Test Cases</h4>
                    <div className="space-y-2">
                        {testCases.map((testCase, index) => {
                            // This is a naive check. Ideally the execution result would map to specific test cases
                            // or provide granular details. For now, if Status is PASS, we assume all pass.
                            // However, strictly speaking, we don't have per-test-case status in the simple ExecutionResult.
                            // We will simply display them.
                            return (
                                <div key={index} className="flex flex-col gap-1 p-2 bg-white rounded border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-500">Shape {index + 1}:</span>
                                        {!testCase.isHidden ? (
                                           <span className="text-xs text-gray-400">Input: {JSON.stringify(testCase.input)}</span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Hidden Test Case</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                 </div>
            )}

            {executionResult.status === 'PASS' && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">All tests passed!</span>
                </div>
            )}
             {executionResult.status === 'FAIL' && (
                <div className="mt-4 flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Some tests failed.</span>
                </div>
            )}

          </div>
        ) : (
          <div className="text-gray-400">Waiting for output...</div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
