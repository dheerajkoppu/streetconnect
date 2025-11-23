"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  ChatMessage,
  ChatContext as ChatContextType,
  Service,
  ServiceCategory,
  FilterState,
} from "@/types";
import { getDefaultFilters } from "@/lib/filters";

interface ChatProviderState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ChatContextValue {
  // State
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;

  // Context setters
  updateContext: (context: Partial<ChatContextType>) => void;
}

const ChatContextProvider = createContext<ChatContextValue | null>(null);

const CHAT_HISTORY_KEY = "streetconnect_chat_history";

// Welcome message shown when chat is first opened
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hi! I'm the StreetConnect Guide.

I can help you:
- Find services that fit your situation
- Explain rules and requirements in simple language
- Create a simple plan for the day
- Draft a text message about a service

Just ask me something like:
- "I need a place to sleep tonight"
- "What does 'low barrier' mean?"
- "Where can I get food without ID?"`,
  timestamp: Date.now(),
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatProviderState>(() => {
    // Try to load chat history from localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CHAT_HISTORY_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            messages: parsed.messages || [WELCOME_MESSAGE],
            isOpen: false,
            isLoading: false,
            error: null,
          };
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return {
      messages: [WELCOME_MESSAGE],
      isOpen: false,
      isLoading: false,
      error: null,
    };
  });

  const [context, setContext] = useState<ChatContextType>({
    cityName: "Los Angeles",
    regionName: "Los Angeles County",
    selectedCategory: null,
    filters: getDefaultFilters(),
    visibleServices: [],
    selectedService: null,
  });

  // Save messages to localStorage
  const saveMessages = useCallback((messages: ChatMessage[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          CHAT_HISTORY_KEY,
          JSON.stringify({ messages })
        );
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  const openChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const clearMessages = useCallback(() => {
    const newMessages = [WELCOME_MESSAGE];
    setState((prev) => ({ ...prev, messages: newMessages }));
    saveMessages(newMessages);
  }, [saveMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Add user message immediately
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...state.messages, userMessage].filter(
              (m) => m.id !== "welcome"
            ),
            context,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        setState((prev) => {
          const newMessages = [...prev.messages, data.message];
          saveMessages(newMessages);
          return {
            ...prev,
            messages: newMessages,
            isLoading: false,
          };
        });
      } catch (error) {
        console.error("Chat error:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Sorry, I couldn't get a response. Please try again.",
        }));
      }
    },
    [state.messages, context, saveMessages]
  );

  const updateContext = useCallback(
    (newContext: Partial<ChatContextType>) => {
      setContext((prev) => ({ ...prev, ...newContext }));
    },
    []
  );

  const value: ChatContextValue = {
    messages: state.messages,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    error: state.error,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearMessages,
    updateContext,
  };

  return (
    <ChatContextProvider.Provider value={value}>
      {children}
    </ChatContextProvider.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContextProvider);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

// Helper hook for components to update context
export function useChatContext() {
  const { updateContext } = useChat();
  return {
    setCity: (cityName: string, regionName: string) =>
      updateContext({ cityName, regionName }),
    setCategory: (selectedCategory: ServiceCategory | null) =>
      updateContext({ selectedCategory }),
    setFilters: (filters: FilterState) => updateContext({ filters }),
    setVisibleServices: (visibleServices: Service[]) =>
      updateContext({ visibleServices }),
    setSelectedService: (selectedService: Service | null) =>
      updateContext({ selectedService }),
  };
}
