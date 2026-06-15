/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { X, Send, Search, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useManagerSessionsByBranchQuery, useGetMessagesQuery, useReplyToCustomerMutation } from "@common/hooks/useChatSession";
import type { ChatSessionResponse } from "@common/interfaces/response/ChatSessionResponse";
import { Button } from "@common/components/ui/button";

interface ManagerBranchChatsModalProps {
  branchId: number;
  branchName: string;
  onClose: () => void;
  initialSessionId?: number;
}

export default function ManagerBranchChatsModal({ branchId, branchName, onClose, initialSessionId }: ManagerBranchChatsModalProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(initialSessionId || null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessionsData, isLoading: isLoadingSessions } = useManagerSessionsByBranchQuery(branchId, 1, 50);
  const sessions = sessionsData?.items || [];

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(selectedSessionId || 0);
  const { mutateAsync: sendReply, isPending: isSending } = useReplyToCustomerMutation(selectedSessionId || 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      if (initialSessionId) {
        setSelectedSessionId(initialSessionId);
      } else {
        setSelectedSessionId(sessions[0].id);
      }
    }
  }, [sessions, selectedSessionId, initialSessionId]);

  const handleSend = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card text-foreground w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Hỗ trợ khách hàng</h2>
            <p className="text-sm text-muted-foreground">Chi nhánh: <span className="font-medium text-primary">{branchName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          <div className="w-1/3 min-w-[300px] border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full pl-9 pr-4 py-2.5 bg-muted border border-transparent rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-background transition-colors text-foreground"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingSessions ? (
                <div className="p-8 text-center text-muted-foreground">Đang tải danh sách...</div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p>Chưa có khách hàng liên hệ</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sessions.map((session: ChatSessionResponse) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-start gap-3 ${selectedSessionId === session.id ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary" : "border-l-4 border-transparent"
                        }`}
                    >
                      {session.customerAvatar ? (
                        <img src={session.customerAvatar} alt={session.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-semibold text-foreground truncate pr-2">
                            {session.customerName || `Khách hàng #${session.customerId}`}
                          </h4>
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {formatTime(session.lastMessageAt || session.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{session.lastMessage || "Đã bắt đầu đoạn chat"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-muted/30">
            {selectedSession ? (
              <>
                <div className="px-6 py-4 bg-card border-b border-border flex items-center gap-3 shrink-0">
                  {selectedSession.customerAvatar ? (
                    <img src={selectedSession.customerAvatar} alt={selectedSession.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedSession.customerName || `Khách hàng #${selectedSession.customerId}`}</h3>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang trực tuyến
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                      {formatDate(selectedSession.createdAt)}
                    </span>
                  </div>

                  {isLoadingMessages ? (
                    <div className="text-center text-muted-foreground">Đang tải tin nhắn...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">Chưa có tin nhắn nào.</div>
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
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-3 h-3 text-primary" />
                                </div>
                              )
                            )}
                            <div
                              className={`p-3.5 rounded-2xl text-sm leading-relaxed ${isManager
                                ? "bg-primary text-primary-foreground rounded-br-none shadow-sm shadow-primary/20"
                                : "bg-card text-foreground rounded-bl-none shadow-sm border border-border"
                                }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                          <span className={`text-[10px] text-muted-foreground mt-1 ${isManager ? "mr-1" : "ml-9"}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      );
                    })
                  )}

                  {isSending && (
                    <div className="flex flex-col items-end">
                      <div className="max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed bg-primary text-primary-foreground rounded-br-none opacity-50 shadow-sm shadow-primary/20">
                        {inputValue || "Đang gửi..."}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-card border-t border-border shrink-0">
                  <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nhập tin nhắn phản hồi..."
                      className="flex-1 bg-muted border border-border text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-background transition-colors"
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isSending}
                      className="rounded-xl flex shrink-0 p-3 h-auto"
                    >
                      <Send className="w-5 h-5 -translate-x-px translate-y-px" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                  <svg className="w-8 h-8 text-muted-foreground/50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
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
