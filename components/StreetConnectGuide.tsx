"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "@/lib/ChatContext";
import { ChatMessage } from "@/types";

// Floating Action Button
function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="chat-fab"
      aria-label="Ask the Guide"
    >
      <svg
        className="w-6 h-6"
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
      <span className="ml-2 font-medium">Ask the Guide</span>
    </button>
  );
}

// Message bubble component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
        }`}
      >
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "" : "chat-message-content"}`}>
          {formatMessageContent(message.content)}
        </div>
      </div>
    </div>
  );
}

// Format message content - handle basic markdown
function formatMessageContent(content: string): React.ReactNode {
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Check if it's a bullet list
    if (paragraph.match(/^[-•]\s/m)) {
      const items = paragraph.split(/\n/).filter(line => line.trim());
      return (
        <ul key={pIndex} className="list-none space-y-1 my-2">
          {items.map((item, iIndex) => (
            <li key={iIndex} className="flex gap-2">
              <span className="text-blue-500 flex-shrink-0">•</span>
              <span>{formatInlineText(item.replace(/^[-•]\s*/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Check if it's a numbered list
    if (paragraph.match(/^\d+\.\s/m)) {
      const items = paragraph.split(/\n/).filter(line => line.trim());
      return (
        <ol key={pIndex} className="list-none space-y-1 my-2">
          {items.map((item, iIndex) => {
            const match = item.match(/^(\d+)\.\s*(.*)/);
            if (match) {
              return (
                <li key={iIndex} className="flex gap-2">
                  <span className="text-blue-600 font-medium flex-shrink-0">{match[1]}.</span>
                  <span>{formatInlineText(match[2])}</span>
                </li>
              );
            }
            return <li key={iIndex}>{formatInlineText(item)}</li>;
          })}
        </ol>
      );
    }

    // Regular paragraph
    return (
      <p key={pIndex} className={pIndex > 0 ? "mt-2" : ""}>
        {formatInlineText(paragraph)}
      </p>
    );
  });
}

// Format inline text - handle bold and links
function formatInlineText(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Loading indicator
function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// Chat input component
function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about services..."
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
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
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  );
}

// Bottom Sheet Chat
function BottomSheetChat({ onClose }: { onClose: () => void }) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="chat-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div className="chat-bottom-sheet" role="dialog" aria-label="StreetConnect Guide">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
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
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">StreetConnect Guide</h2>
              <p className="text-xs text-gray-500">Here to help you find services</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearMessages}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear chat"
              title="Start new conversation"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close chat"
            >
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 chat-messages">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
          {error && (
            <div className="text-center py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white rounded-b-[var(--radius-2xl)]">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </>
  );
}

// Main export - combines FAB and Bottom Sheet
export function StreetConnectGuide() {
  const { isOpen, openChat, closeChat } = useChat();

  return (
    <>
      {!isOpen && <FloatingButton onClick={openChat} />}
      {isOpen && <BottomSheetChat onClose={closeChat} />}
    </>
  );
}
