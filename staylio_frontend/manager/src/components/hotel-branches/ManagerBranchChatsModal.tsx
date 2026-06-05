import { useState, useEffect, useRef } from "react";
import { X, Send, Search, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useManagerSessionsByBranchQuery, useGetMessagesQuery, useReplyToCustomerMutation } from "@common/hooks/useChatSession";
import type { ChatSessionResponse } from "@common/interfaces/response/ChatSessionResponse";

interface ManagerBranchChatsModalProps {
  branchId: number;
  branchName: string;
  onClose: () => void;
}

export default function ManagerBranchChatsModal({ branchId, branchName, onClose }: ManagerBranchChatsModalProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat sessions for this branch
  const { data: sessionsData, isLoading: isLoadingSessions } = useManagerSessionsByBranchQuery(branchId, 1, 50);
  const sessions = sessionsData?.items || [];

  // Find selected session details
  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  // Fetch messages for the selected session
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(selectedSessionId || 0);

  // Mutation to send reply
  const { mutateAsync: sendReply, isPending: isSending } = useReplyToCustomerMutation(selectedSessionId || 0);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If sessions load and none is selected, auto-select the first one
  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedSessionId || isSending) return;

    try {
      await sendReply(inputValue.trim());
      setInputValue("");
      refetchMessages();
    } catch (error) {
      console.error("Failed to send reply", error);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "HH:mm", { locale: vi });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hỗ trợ khách hàng</h2>
            <p className="text-sm text-gray-500">Chi nhánh: <span className="font-medium text-blue-600">{branchName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar: Session List */}
          <div className="w-1/3 min-w-[300px] border-r border-gray-100 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingSessions ? (
                <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <p>Chưa có khách hàng liên hệ</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {sessions.map((session: ChatSessionResponse) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selectedSessionId === session.id ? "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                        }`}
                    >
                      {session.customerAvatar ? (
                        <img src={session.customerAvatar} alt={session.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-semibold text-gray-900 truncate pr-2">
                            {session.customerName || `Khách hàng #${session.customerId}`}
                          </h4>
                          <span className="text-[11px] text-gray-400 shrink-0">
                            {formatTime(session.lastMessageAt || session.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{session.lastMessage || "Đã bắt đầu đoạn chat"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0">
                  {selectedSession.customerAvatar ? (
                    <img src={selectedSession.customerAvatar} alt={selectedSession.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedSession.customerName || `Khách hàng #${selectedSession.customerId}`}</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang trực tuyến
                    </p>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {formatDate(selectedSession.createdAt)}
                    </span>
                  </div>

                  {isLoadingMessages ? (
                    <div className="text-center text-gray-400">Đang tải tin nhắn...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400">Chưa có tin nhắn nào.</div>
                  ) : (
                    messages.map((msg, index) => {
                      const isManager = msg.senderType === "MANAGER";
                      return (
                        <div key={msg.id || index} className={`flex flex-col ${isManager ? "items-end" : "items-start"}`}>
                          <div className="flex items-end gap-2 max-w-[75%]">
                            {!isManager && (
                              msg.senderAvatar ? (
                                <img src={msg.senderAvatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="w-3 h-3 text-blue-600" />
                                </div>
                              )
                            )}
                            <div
                              className={`p-3.5 rounded-2xl text-sm leading-relaxed ${isManager
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                                }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                          <span className={`text-[10px] text-gray-400 mt-1 ${isManager ? "mr-1" : "ml-9"}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      );
                    })
                  )}

                  {isSending && (
                    <div className="flex flex-col items-end">
                      <div className="max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed bg-blue-600 text-white rounded-br-none opacity-50">
                        {inputValue || "Đang gửi..."}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                  <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nhập tin nhắn phản hồi..."
                      className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isSending}
                      className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex shrink-0"
                    >
                      <Send className="w-5 h-5 -translate-x-px translate-y-px" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                </div>
                <p>Chọn một khách hàng để bắt đầu chat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
