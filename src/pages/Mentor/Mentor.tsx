import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hello! I'm your AI Mentor. I can help you with coding questions, explain complex concepts, or guide you through your curriculum. How can I assist you today?",
  timestamp: new Date()
};

const Mentor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm currently running in mock mode, but I understood your request! In the future, I will connect to the backend to provide real-time coding assistance based on your context.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex-none mb-6 text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">AI Mentor</h1>
            <p className="text-gray-500">Your personal coding assistant, available 24/7.</p>
        </div>

        <Card className="flex-grow flex flex-col overflow-hidden shadow-xl border-t-4 border-indigo-500">
            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <span className={`text-[10px] block mt-1 opacity-70 ${msg.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                    <Input 
                        placeholder="Ask anything about coding, algorithms, or your lessons..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-grow shadow-sm"
                        autoFocus
                    />
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={!inputValue.trim() || isTyping}
                        className="px-6"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </Button>
                </form>
            </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Mentor;
