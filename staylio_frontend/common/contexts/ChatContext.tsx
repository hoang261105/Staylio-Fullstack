import React, { createContext, useContext, useState, ReactNode } from "react";

type ChatType = "AI" | "MANAGER";

interface ChatContextProps {
  isOpen: boolean;
  chatType: ChatType;
  targetBranchId: number | null;
  managerName: string | null;
  openAIChat: () => void;
  openManagerChat: (branchId: number, managerName: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatType, setChatType] = useState<ChatType>("AI");
  const [targetBranchId, setTargetBranchId] = useState<number | null>(null);
  const [managerName, setManagerName] = useState<string | null>(null);

  const openAIChat = () => {
    setChatType("AI");
    setTargetBranchId(null);
    setManagerName(null);
    setIsOpen(true);
  };

  const openManagerChat = (branchId: number, name: string) => {
    setChatType("MANAGER");
    setTargetBranchId(branchId);
    setManagerName(name);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && chatType !== "AI") {
        setChatType("AI"); // default back to AI on normal toggle
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        chatType,
        targetBranchId,
        managerName,
        openAIChat,
        openManagerChat,
        closeChat,
        toggleChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
