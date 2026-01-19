import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import type { JSendResponse, Challenge, ExecutionResult } from '../../types/api';

interface LessonResponse {
  id: string;
  title: string;
  contentMarkdown: string;
  challenge?: Challenge;
  nextLessonId?: string;
  prevLessonId?: string;
}

const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Challenge State
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      setIsLoading(true);
      setOutput(null);
      try {
        const response = await api.get<JSendResponse<LessonResponse>>(`/lessons/${lessonId}`);
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setLesson(data);
          if (data.challenge) {
            setCode(data.challenge.starterCode);
          }
        }
      } catch (error) {
        console.error('Failed to load lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleRunCode = async () => {
    if (!lesson?.challenge) return;
    
    setIsRunning(true);
    try {
      const response = await api.post<JSendResponse<ExecutionResult>>('/execution/run', {
        challengeId: lesson.challenge.id,
        code: code,
        language: lesson.challenge.language
      });
      
      if (response.data.success && response.data.data) {
        setOutput(response.data.data);
        
        // If passed, mark lesson as completed
        if (response.data.data.status === 'PASS') {
            await api.put(`/users/progress/${lesson.id}`, { isCompleted: true });
        }
      }
    } catch (error) {
        console.error('Execution failed:', error);
        setOutput({
            status: 'ERROR',
            stdout: '',
            stderr: 'Failed to execute code.',
            metrics: { runtime: '0s' }
        });
    } finally {
      setIsRunning(false);
    }
  };

  const handleNext = () => {
      if (lesson?.nextLessonId) {
          navigate(`/lessons/${lesson.nextLessonId}`);
      }
  };

  const handlePrev = () => {
      if (lesson?.prevLessonId) {
          navigate(`/lessons/${lesson.prevLessonId}`);
      }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!lesson) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900">Lesson not found</h2>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
        {/* Content Pane */}
        <div className="lg:w-1/2 flex flex-col h-full overflow-hidden">
           <Card className="h-full flex flex-col overflow-hidden">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                        <div className="mt-2 flex space-x-2">
                             <Badge>Lesson</Badge>
                             {lesson.challenge && <Badge variant="info">Coding Challenge</Badge>}
                        </div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-6 prose prose-indigo max-w-none">
                     <ReactMarkdown>{lesson.contentMarkdown || ''}</ReactMarkdown>
                </div>
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={!lesson.prevLessonId}
                        onClick={handlePrev}
                    >
                        ← Previous
                    </Button>
                    <Button 
                         variant="primary"
                         size="sm"
                         disabled={!lesson.nextLessonId && !lesson.challenge}
                         onClick={handleNext}
                    >
                        {lesson.challenge ? 'Skip to Next' : 'Next Lesson →'}
                    </Button>
                </div>
           </Card>
        </div>

        {/* Challenge Pane */}
        {lesson.challenge && (
            <div className="lg:w-1/2 flex flex-col h-full">
                <Card className="h-full flex flex-col bg-gray-900 text-white border-gray-800">
                    <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                        <span className="font-mono text-sm text-gray-400">main.{lesson.challenge.language === 'python' ? 'py' : 'js'}</span>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={handleRunCode}
                            isLoading={isRunning}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-none"
                        >
                            Play Code
                        </Button>
                    </div>
                    <div className="flex-grow relative">
                        <textarea 
                            className="w-full h-full bg-gray-900 text-gray-100 font-mono p-4 resize-none focus:outline-none text-sm leading-relaxed"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                    
                    {/* Output Console */}
                    <div className={`border-t border-gray-800 bg-black/50 transition-all duration-300 flex flex-col ${output ? 'h-48' : 'h-10'}`}>
                         <div className="px-4 py-2 border-b border-gray-800 text-xs font-mono text-gray-500 uppercase tracking-wider flex justify-between">
                            <span>Console Output</span>
                            {output && (
                                <Badge variant={output.status === 'PASS' ? 'success' : 'error'} className="text-[10px] px-1 py-0 h-4">
                                    {output.status}
                                </Badge>
                            )}
                         </div>
                         {output && (
                             <div className="p-4 font-mono text-sm overflow-y-auto flex-grow">
                                {output.stdout && <div className="text-gray-300 whitespace-pre-wrap">{output.stdout}</div>}
                                {output.stderr && <div className="text-red-400 whitespace-pre-wrap">{output.stderr}</div>}
                                {output.metrics && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        Runtime: {output.metrics.runtime}
                                    </div>
                                )}
                             </div>
                         )}
                    </div>
                </Card>
            </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LessonView;
