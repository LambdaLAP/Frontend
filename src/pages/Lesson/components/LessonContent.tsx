import React from "react";
import ReactMarkdown from "react-markdown";

interface LessonContentProps {
  content: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none p-6 bg-white h-full overflow-y-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default LessonContent;
