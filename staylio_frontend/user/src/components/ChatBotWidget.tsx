/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect, type SyntheticEvent } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  useCreateChatAIMutation,
  useSendAIMessage,
  useGetMessagesQuery,
  useStartManagerChatMutation,
  useSendManagerMessage,
} from "../../../common/hooks/useChatSession";
import { MessageSenderType } from "../../../common/enums/MessageSenderType";
import type { ChatMessageResponse } from "../../../common/interfaces/response/ChatMessageResponse";
import { useChatContext } from "../../../common/contexts/ChatContext";

export default function ChatBotWidget() {
  const { isOpen, chatType, targetBranchId, managerName, closeChat, toggleChat } = useChatContext();
  const [currentSessionId, setCurrentSessionId] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: createAiSession } = useCreateChatAIMutation();
  const { mutateAsync: createManagerSession } = useStartManagerChatMutation();

  const { mutateAsync: sendAiMessage, isPending: isSendingAi } = useSendAIMessage(currentSessionId);
  const { mutateAsync: sendManagerMessage, isPending: isSendingManager } = useSendManagerMessage(currentSessionId);

  const isSending = chatType === "AI" ? isSendingAi : isSendingManager;
  const { data: messages = [], refetch } = useGetMessagesQuery(currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const initSession = async () => {
        try {
          if (chatType === "AI") {
            const res = await createAiSession();
            if (res?.data?.id) setCurrentSessionId(res.data.id);
          } else if (chatType === "MANAGER" && targetBranchId) {
            const res = await createManagerSession({ hotelBranchId: targetBranchId });
            if (res?.data?.id) setCurrentSessionId(res.data.id);
          }
        } catch (error) {
          console.error("Failed to init chat session", error);
        }
      };
      initSession();
    }
  }, [isOpen, chatType, targetBranchId]);

  const handleOpenChat = () => {
    toggleChat();
  };

  const handleSend = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || currentSessionId === 0) return;

    const content = inputValue;
    setInputValue("");

    try {
      if (chatType === "AI") {
        await sendAiMessage(content);
      } else {
        await sendManagerMessage(content);
      }
      refetch();
    } catch (error) {
      setInputValue(content);
    }
  };

  // Common components for markdown rendering
  const MarkdownComponents = {
    ul: ({ node, ...props }: any) => <ul className="list-disc list-outside ml-4 mt-2 mb-2 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-outside ml-4 mt-2 mb-2 space-y-1" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1 leading-relaxed" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-inherit" {...props} />,
    a: ({ node, ...props }: any) => <a className="underline font-medium hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
    h1: ({ node, ...props }: any) => <h1 className="text-lg font-bold mb-2 mt-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-md font-bold mb-2 mt-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="font-bold mb-1 mt-2" {...props} />,
  };

  return (
    <>
      <button
        onClick={handleOpenChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-100 transition-all duration-300 flex items-center justify-center ${isOpen
          ? "bg-gray-900 text-white hover:bg-gray-800 rotate-90 scale-0 opacity-0 pointer-events-none"
          : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:-translate-y-1 rotate-0 scale-100 opacity-100"
          }`}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-full max-w-90 sm:max-w-100 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-100 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${isOpen
          ? "scale-100 opacity-100 pointer-events-auto translate-y-0"
          : "scale-50 opacity-0 pointer-events-none translate-y-10"
          }`}
        style={{ height: "600px", maxHeight: "calc(100vh - 100px)" }}
      >
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white dark:bg-gray-800/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white dark:bg-gray-800/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              {chatType === "AI" ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg leading-tight">
                {chatType === "AI" ? "Staylio AI" : `Quản lý: ${managerName || "Đang cập nhật"}`}
              </h3>
              <p className="text-blue-100 text-xs font-medium">Trực tuyến</p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="text-white/80 hover:text-white hover:bg-white dark:bg-gray-800/20 p-2 rounded-full transition-colors relative z-10"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-gray-900 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.length === 0 && currentSessionId !== 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-4">
              Hãy bắt đầu cuộc trò chuyện với {chatType === "AI" ? "AI" : "Quản lý"}...
            </div>
          )}
          {messages.map((msg: ChatMessageResponse) => {
            const isCustomer = msg.senderType === MessageSenderType.USER;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isCustomer ? "justify-end" : "justify-start"
                  }`}
              >
                {!isCustomer && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-b dark:border-gray-700lue-200">
                    {msg.senderType === MessageSenderType.AI ? <Bot className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-blue-600" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isCustomer
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700"
                    }`}
                >
                  {isCustomer ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-inherit">
                      <ReactMarkdown components={MarkdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {isCustomer && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
          {isSending && (
            <div className="flex items-end gap-2 justify-end">
              <div className="max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-blue-600 text-white rounded-br-none opacity-50">
                {inputValue || "Đang gửi..."}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-600 focus-within:border-b dark:border-gray-700lue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isSending || currentSessionId === 0}
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-800 dark:text-gray-100 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending || currentSessionId === 0}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 -translate-x-px translate-y-px" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
