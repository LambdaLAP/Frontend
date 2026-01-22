import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { lessonService } from "../../services/lessonService";
import { userService } from "../../services/userService";
import type { Lesson, Challenge } from "../../types/api";
import LessonContent from "./components/LessonContent";
import CodeWorkspace from "./components/CodeWorkspace";
import Button from "../../components/ui/Button";

const LessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track active challenge or generic code state
  // If lesson type is LESSON, functionality might be limited or illustrative
  // If type is CHALLENGE, we focus on the code
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await lessonService.getLesson(lessonId);
        
        // Check enrollment if courseId is available on the lesson
        if (data.courseId) {
            const enrollments = await userService.getEnrollments();
            const isEnrolled = enrollments.some(e => e.courseId === data.courseId);
            
            if (!isEnrolled) {
                navigate(`/courses/${data.courseId}`);
                return;
            }
        }

        setLesson(data);
        
        // Default to first challenge if available
        if (data.challenges && data.challenges.length > 0) {
            setActiveChallenge(data.challenges[0]);
        } else {
            setActiveChallenge(null);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading lesson...
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-red-500 gap-4">
        <p>{error || "Lesson not found"}</p>
        <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
        </Button>
      </div>
    );
  }

  // Determine initial code and language
  // Fallback to python/empty if not present
  const initialCode = activeChallenge 
    ? (activeChallenge.starterCodes?.["python"] || activeChallenge.starterCodes?.[Object.keys(activeChallenge.starterCodes)[0]] || "")
    : "";
  
  const language = "python"; // Defaulting to python for now as per requirement snippet or dynamic based on user selection in future

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-gray-900">
      {/* Navigation Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shadow-sm flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <Home className="w-5 h-5"/>
            </Link>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson {lesson.orderIndex}</span>
                <h1 className="text-sm font-bold text-gray-800">{lesson.title}</h1>
            </div>
        </div>

        <div className="flex items-center gap-2">
            {lesson.prevLessonId && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/lessons/${lesson.prevLessonId}`)}
                    className="text-gray-600"
                >
                    <ChevronLeft className="w-4 h-4 mr-1"/> Previous
                </Button>
            )}
             {lesson.nextLessonId && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/lessons/${lesson.nextLessonId}`)}
                >
                    Next <ChevronRight className="w-4 h-4 ml-1"/>
                </Button>
            )}
        </div>
      </header>

      {/* Main Workspace Resizable Layout */}
      <div className="flex-1 min-h-0 relative">
        <PanelGroup orientation="horizontal">
            {/* Left Panel: Content */}
            <Panel defaultSize={40} minSize={20} className="bg-white">
                <LessonContent content={lesson.contentMarkdown || "# No content available"} />
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-gray-100 border-x border-gray-200 hover:bg-blue-50 transition-colors flex items-center justify-center cursor-col-resize z-10">
                <div className="h-8 w-1 bg-gray-300 rounded-full" />
            </PanelResizeHandle>

            {/* Right Panel: Code Workspace */}
            <Panel defaultSize={60} minSize={30}>
                {/* Re-mount workspace if challenge changes to reset code state properly, or handle internal updates */}
                <CodeWorkspace 
                    key={activeChallenge?.id || 'no-challenge'}
                    initialCode={initialCode}
                    language={language}
                    challengeId={activeChallenge?.id}
                    challenge={activeChallenge || undefined}
                />
            </Panel>

        </PanelGroup>
      </div>
    </div>
  );
};

export default LessonView;
