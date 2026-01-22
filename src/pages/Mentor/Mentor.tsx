import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Button from "../../components/ui/Button";
// import Input from '../../components/ui/Input';

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "React Components Help",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messages: [
      {
        id: "1-1",
        role: "user",
        content: "How do I create a functional component?",
        timestamp: new Date(),
      },
      {
        id: "1-2",
        role: "assistant",
        content:
          "You can create a functional component using a simple function that returns JSX. Here is an example...",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "2",
    title: "Explain Async/Await",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    messages: [
      {
        id: "2-1",
        role: "user",
        content: "Can you explain async/await in JS?",
        timestamp: new Date(),
      },
      {
        id: "2-2",
        role: "assistant",
        content: "Async/await is syntactic sugar on top of Promises...",
        timestamp: new Date(),
      },
    ],
  },
];

const NEW_CHAT_ID = "new";

const Mentor: React.FC = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [currentChatId, setCurrentChatId] = useState<string>(NEW_CHAT_ID);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current messages or empty for new chat
  const currentMessages =
    conversations.find((c) => c.id === currentChatId)?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChatId, conversations, isTyping]);

  const handleNewChat = () => {
    setCurrentChatId(NEW_CHAT_ID);
    setInputValue("");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setInputValue("");
    setIsTyping(true);

    // If sending in a "new" chat, create a proper conversation entry first
    if (currentChatId === NEW_CHAT_ID) {
      const newId = Date.now().toString();
      const newConversation: Conversation = {
        id: newId,
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : ""), // Simple title generation
        messages: [newMessage],
        lastUpdated: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentChatId(newId);
    } else {
      // Append to existing
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentChatId) {
            return {
              ...c,
              messages: [...c.messages, newMessage],
              lastUpdated: new Date(),
            };
          }
          return c;
        })
      );
    }

    // Mock AI Response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm a mocked AI response. I see you said: \"" +
          inputValue +
          '". Developing the real backend connection is our next step!',
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          // We need to find the chat ID. If we just created text in new chat, we switched `currentChatId` above.
          // Wait, `currentChatId` state update might not flush immediately in this closure if we relied on state,
          // but we are setting state with functional updates so it is safer to rely on the logic:
          // However, `currentChatId` variable in THIS render is still `new` if we started as new.
          // So we need a stable reference or logic.

          // Actually, for simplicity in this mock, let's just update the *latest* conversation if we were in "new",
          // or the specific ID if we weren't.

          // A better approach for this closure issue:
          const targetId =
            currentChatId === NEW_CHAT_ID ? prev[0].id : currentChatId; // prev[0] is the one we just unshifted

          if (c.id === targetId) {
            return {
              ...c,
              messages: [...c.messages, aiMessage],
            };
          }
          return c;
        })
      );
      setIsTyping(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col hidden md:flex">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition-colors border border-gray-200 text-sm mb-4 shadow-sm"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent
            </div>
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors truncate flex items-center gap-3 ${
                  currentChatId === chat.id
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>

          {/* Account section removed as requested */}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative w-full">
          {/* Header (Mobile Only) */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <span className="font-semibold text-gray-700">Chat</span>
            <Button size="sm" variant="ghost" onClick={handleNewChat}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto w-full">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-800">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm mb-6 flex items-center justify-center">
                  <img
                    src="/src/assets/Logo.png"
                    alt="Logo"
                    className="w-10 h-10"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  How can I help you today?
                </h2>
              </div>
            ) : (
              <div className="w-full pb-32">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`w-full border-b border-black/5 ${
                      msg.role === "assistant" ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <div className="max-w-3xl mx-auto px-4 py-8 flex gap-4 md:gap-6">
                      <div className="flex-shrink-0 flex flex-col relative items-end">
                        <div
                          className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                            msg.role === "assistant"
                              ? "bg-green-500"
                              : "bg-indigo-600"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          ) : (
                            <span className="text-white text-xs">U</span>
                          )}
                        </div>
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <div className="text-gray-800 prose prose-slate max-w-none">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="w-full border-b border-black/5 bg-gray-50/50">
                    <div className="max-w-3xl mx-auto px-4 py-8 flex gap-4 md:gap-6">
                      <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
            <div className="max-w-3xl mx-auto relative">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center w-full p-3 bg-white border border-gray-200 rounded-xl shadow-lg focus-within:ring-1 focus-within:ring-black/10"
              >
                <input
                  className="flex-grow bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 resize-none max-h-52 py-2 px-2 outline-none"
                  placeholder="Send a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 rounded-md transition-colors ${
                    inputValue.trim()
                      ? "bg-indigo-500 text-white"
                      : "bg-transparent text-gray-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
              <div className="text-center text-xs text-gray-400 mt-2">
                AI can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Mentor;
