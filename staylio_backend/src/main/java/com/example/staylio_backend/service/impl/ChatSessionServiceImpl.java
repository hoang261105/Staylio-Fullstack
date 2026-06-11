package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ChatSessionRequest;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.dto.request.SendChatMessageRequest;
import com.example.staylio_backend.dto.request.StartManagerChatRequest;
import com.example.staylio_backend.dto.response.ChatMessageResponse;
import com.example.staylio_backend.dto.response.ChatSessionResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.*;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.ChatSessionService;
import com.example.staylio_backend.service.NotificationService;
import org.springframework.ai.chat.client.ChatClient;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ChatSessionServiceImpl implements ChatSessionService {

        private final ChatSessionRepo chatSessionRepo;
        private final ChatMessageRepo chatMessageRepo;
        private final ProfileRepo profileRepo;
        private final RoomRepo roomRepo;
        private final HotelBranchRepo branchRepo;
        private final NotificationService notificationService;
        private final ChatClient chatClient;

        public ChatSessionServiceImpl(
                        ChatSessionRepo chatSessionRepo,
                        ChatMessageRepo chatMessageRepo,
                        ProfileRepo profileRepo,
                        RoomRepo roomRepo,
                        HotelBranchRepo branchRepo,
                        NotificationService notificationService,
                        ChatClient.Builder chatClientBuilder) {
                this.chatSessionRepo = chatSessionRepo;
                this.chatMessageRepo = chatMessageRepo;
                this.profileRepo = profileRepo;
                this.roomRepo = roomRepo;
                this.branchRepo = branchRepo;
                this.notificationService = notificationService;
                this.chatClient = chatClientBuilder
                                .defaultSystem("Bạn là trợ lý AI của hệ thống đặt phòng khách sạn Staylio. " +
                                                "Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm khách sạn, phòng, và trả lời các thắc mắc. "
                                                +
                                                "Luôn trả lời bằng tiếng Việt, thân thiện, và ngắn gọn. " +
                                                "Sử dụng các công cụ (tools/functions) được cung cấp để tra cứu dữ liệu khách sạn trước khi trả lời. "
                                                +
                                                "Tuyệt đối không tự bịa thông tin phòng và giá phòng. " +
                                                "QUAN TRỌNG 1: Nếu người dùng hỏi những câu hỏi KHÔNG LIÊN QUAN đến khách sạn, phòng nghỉ, du lịch hoặc dịch vụ của Staylio (ví dụ: toán học như 1+1 bằng mấy, lập trình, chính trị...), "
                                                +
                                                "hãy từ chối trả lời một cách lịch sự và hướng người dùng quay lại chủ đề đặt phòng. " +
                                                "QUAN TRỌNG 2: Khi liệt kê các phòng tìm được, LUÔN LUÔN đính kèm đường link dạng Markdown để người dùng click vào xem chi tiết theo cú pháp sau: [Tên phòng](/hotel/{hotelId}/branch/{branchId}/room/{roomId}) (thay thế các ID bằng dữ liệu thật từ tool).")
                                .build();
        }

        @Override
        public ChatSessionResponse createOrGetAiSession(UserPrincipal principal) {
                Profile profile = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

                ChatSession session = chatSessionRepo
                                .findFirstByUser_IdAndTypeAndStatus(
                                                profile.getId(),
                                                ChatSessionType.AI,
                                                ChatSessionStatus.OPEN)
                                .orElseGet(() -> chatSessionRepo.save(
                                                ChatSession.builder()
                                                                .user(profile)
                                                                .manager(null)
                                                                .hotelBranch(null)
                                                                .room(null)
                                                                .type(ChatSessionType.AI)
                                                                .status(ChatSessionStatus.OPEN)
                                                                .build()));

                return convertSessionToResponse(session);
        }

        @Override
        public ChatMessageResponse sendMessage(
                        Long sessionId,
                        ChatSessionRequest request,
                        UserPrincipal principal) {
                ChatMessage userMessage = null;
                try {
                        ChatSession session = chatSessionRepo.findById(sessionId)
                                        .orElseThrow(() -> new NoSuchElementException(
                                                        ErrorCode.CHAT_SESSION_NOT_FOUND.getMessage()));

                        Profile profile = profileRepo.findById(principal.getId())
                                        .orElseThrow(() -> new NoSuchElementException(
                                                        ErrorCode.USER_NOT_FOUND.getMessage()));

                        if (!session.getUser().getId().equals(profile.getId())) {
                                throw new AppException(ErrorCode.UNAUTHORIZED);
                        }

                        if (session.getStatus() == ChatSessionStatus.CLOSED) {
                                throw new AppException(ErrorCode.CHAT_SESSION_CLOSED);
                        }

                        userMessage = ChatMessage.builder()
                                        .session(session)
                                        .sender(profile)
                                        .senderType(MessageSenderType.USER)
                                        .content(request.getContent())
                                        .isRead(true)
                                        .build();

                        chatMessageRepo.save(userMessage);

                        String aiAnswer = chatClient.prompt()
                                        .user(request.getContent())
                                        .functions("searchAvailableRoomsFunction")
                                        .call()
                                        .content();

                        ChatMessage aiMessage = ChatMessage.builder()
                                        .session(session)
                                        .sender(null)
                                        .senderType(MessageSenderType.AI)
                                        .content(aiAnswer)
                                        .isRead(false)
                                        .build();

                        ChatMessage savedAiMessage = chatMessageRepo.save(aiMessage);

                        return convertMessageToResponse(savedAiMessage);

                } catch (Exception ex) {
                        ex.printStackTrace();
                        if (userMessage != null && userMessage.getId() != null) {
                                chatMessageRepo.delete(userMessage);
                        }
                        throw new AppException(
                                        ErrorCode.AI_QUOTA_EXCEEDED,
                                        "AI hiện đã hết lượt miễn phí hoặc đang gặp sự cố, vui lòng thử lại sau. (Chi tiết lỗi xem ở Console log)");
                }
        }

        @Override
        public List<ChatMessageResponse> getMessages(
                        Long sessionId,
                        UserPrincipal principal) {
                Profile profile = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

                ChatSession session = chatSessionRepo.findById(sessionId)
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy đoạn chat!"));

                if (!session.getUser().getId().equals(profile.getId()) &&
                                (session.getManager() == null
                                                || !session.getManager().getId().equals(profile.getId()))) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                List<ChatMessage> messages = chatMessageRepo.findAllBySession_IdOrderByCreatedAtAsc(sessionId);

                return messages.stream()
                                .map(this::convertMessageToResponse)
                                .toList();
        }

        @Override
        public ChatSessionResponse startChatWithManager(StartManagerChatRequest request, UserPrincipal principal) {
                Profile customer = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException(
                                                ErrorCode.USER_NOT_FOUND.getMessage()));

                HotelBranch branch;

                if (request.getRoomId() != null) {
                        Room room = roomRepo.findById(request.getRoomId())
                                        .orElseThrow(() -> new NoSuchElementException(
                                                        ErrorCode.ROOM_NOT_FOUND.getMessage()));
                        branch = room.getHotelBranch();
                } else {
                        branch = branchRepo.findById(request.getHotelBranchId())
                                        .orElseThrow(() -> new NoSuchElementException(
                                                        ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));
                }

                Profile manager = branch.getHotel().getManager();

                if (manager == null) {
                        throw new AppException(ErrorCode.USER_NOT_FOUND);
                }

                ChatSession session = chatSessionRepo.findOpenManagerSession(
                                customer.getId(),
                                manager.getId(),
                                branch.getId()).orElseGet(
                                                () -> chatSessionRepo.save(
                                                                ChatSession.builder()
                                                                                .user(customer)
                                                                                .manager(manager)
                                                                                .hotelBranch(branch)
                                                                                .type(ChatSessionType.MANAGER)
                                                                                .status(ChatSessionStatus.OPEN)
                                                                                .build()));

                return convertSessionToResponse(session);
        }

        @Override
        @Transactional
        public ChatMessageResponse sendMessageToManager(SendChatMessageRequest request, UserPrincipal principal) {
                ChatSession session = chatSessionRepo.findById(request.getSessionId())
                                .orElseThrow(() -> new NoSuchElementException(
                                                ErrorCode.CHAT_SESSION_NOT_FOUND.getMessage()));

                if (!session.getUser().getId().equals(principal.getId())) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                Profile sender = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException(
                                                ErrorCode.USER_NOT_FOUND.getMessage()));

                ChatMessage message = ChatMessage.builder()
                                .session(session)
                                .sender(sender)
                                .senderType(MessageSenderType.USER)
                                .content(request.getContent())
                                .isRead(false)
                                .build();

                ChatMessage saved = chatMessageRepo.save(message);

                session.setUpdatedAt(LocalDateTime.now());
                chatSessionRepo.save(session);

                notificationService.create(
                                NotificationRequest.builder()
                                                .senderId(session.getUser().getId())
                                                .receiverId(session.getManager().getId())
                                                .title("Có tin nhắn mới từ khách hàng")
                                                .content(session.getUser().getFullName()
                                                                + " vừa gửi tin nhắn cho bạn đến chi nhánh "
                                                                + session.getHotelBranch().getBranchName() + ".")
                                                .type(NotificationType.CHAT_MESSAGE_CREATED)
                                                .referenceId(session.getId())
                                                .build());

                return convertMessageToResponse(saved);
        }

        @Override
        @Transactional
        public ChatMessageResponse managerReply(SendChatMessageRequest request, UserPrincipal principal) {
                ChatSession session = chatSessionRepo.findById(request.getSessionId())
                                .orElseThrow(() -> new NoSuchElementException(
                                                ErrorCode.CHAT_SESSION_NOT_FOUND.getMessage()));

                if (!session.getManager().getId().equals(principal.getId())) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                Profile sender = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException(
                                                ErrorCode.USER_NOT_FOUND.getMessage()));

                ChatMessage message = ChatMessage.builder()
                                .session(session)
                                .sender(sender)
                                .senderType(MessageSenderType.MANAGER)
                                .content(request.getContent())
                                .isRead(false)
                                .build();

                ChatMessage saved = chatMessageRepo.save(message);

                session.setUpdatedAt(LocalDateTime.now());
                chatSessionRepo.save(session);

                notificationService.create(
                                NotificationRequest.builder()
                                                .senderId(session.getManager().getId())
                                                .receiverId(session.getUser().getId())
                                                .title("Quản lý đã phản hồi tin nhắn của bạn")
                                                .content("Bạn có tin nhắn mới từ quản lý khách sạn.")
                                                .type(NotificationType.CHAT_MESSAGE_CREATED)
                                                .referenceId(session.getId())
                                                .build());

                return convertMessageToResponse(saved);
        }

        @Override
        public PaginationResponse<ChatSessionResponse> getMyManagerSessions(int page, int size,
                        UserPrincipal principal) {
                Pageable pageable = PageRequest.of(
                                Math.max(page - 1, 0),
                                size,
                                Sort.by(Sort.Direction.DESC, "updatedAt"));

                Page<ChatSession> sessionPage;

                if (principal.hasRole(RoleName.ROLE_CUSTOMER)) {
                        sessionPage = chatSessionRepo.findCustomerManagerSessions(
                                        principal.getId(),
                                        pageable);
                } else if (principal.hasRole(RoleName.ROLE_MANAGER)) {
                        sessionPage = chatSessionRepo.findManagerSessions(
                                        principal.getId(),
                                        pageable);
                } else {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                List<ChatSessionResponse> content = sessionPage.getContent()
                                .stream()
                                .map(this::convertSessionToResponse)
                                .toList();

                PaginationDTO pagination = new PaginationDTO(
                                sessionPage.getNumber() + 1,
                                sessionPage.getSize(),
                                sessionPage.getTotalPages(),
                                sessionPage.getTotalElements());

                return new PaginationResponse<>(content, pagination);
        }

        @Override
        public PaginationResponse<ChatSessionResponse> getManagerSessionsByBranch(Long branchId, int page, int size,
                        UserPrincipal principal) {
                if (!principal.hasRole(RoleName.ROLE_MANAGER)) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                Pageable pageable = PageRequest.of(
                                Math.max(page - 1, 0),
                                size,
                                Sort.by(Sort.Direction.DESC, "updatedAt"));

                Page<ChatSession> sessionPage = chatSessionRepo.findManagerSessionsByBranchId(
                                principal.getId(),
                                branchId,
                                pageable);

                List<ChatSessionResponse> content = sessionPage.getContent()
                                .stream()
                                .map(this::convertSessionToResponse)
                                .toList();

                PaginationDTO pagination = new PaginationDTO(
                                sessionPage.getNumber() + 1,
                                sessionPage.getSize(),
                                sessionPage.getTotalPages(),
                                sessionPage.getTotalElements());

                return new PaginationResponse<>(content, pagination);
        }

        // Các helper methods cũ đã được xóa vì Spring AI tự động gọi Tool (Function
        // Calling).

        private ChatMessageResponse convertMessageToResponse(ChatMessage message) {
                Profile sender = message.getSender();

                return ChatMessageResponse.builder()
                                .id(message.getId())
                                .sessionId(message.getSession().getId())
                                .senderId(sender != null ? sender.getId() : null)
                                .senderName(sender != null ? sender.getFullName() : "Staylio AI")
                                .senderAvatar(sender != null ? sender.getAvatarUrl() : null)
                                .senderType(message.getSenderType())
                                .content(message.getContent())
                                .isRead(message.getIsRead())
                                .createdAt(message.getCreatedAt())
                                .build();
        }

        private ChatSessionResponse convertSessionToResponse(ChatSession session) {
                ChatMessage lastMessage = chatMessageRepo
                                .findFirstBySession_IdOrderByCreatedAtDesc(session.getId())
                                .orElse(null);

                Profile customer = session.getUser();

                return ChatSessionResponse.builder()
                                .id(session.getId())
                                .type(session.getType())
                                .status(session.getStatus())
                                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                                .lastMessageAt(lastMessage != null ? lastMessage.getCreatedAt() : null)
                                .unreadCount(0L)
                                .createdAt(session.getCreatedAt())
                                .customerId(customer != null ? customer.getId() : null)
                                .customerName(customer != null ? customer.getFullName() : null)
                                .customerAvatar(customer != null ? customer.getAvatarUrl() : null)
                                .branchId(session.getHotelBranch() != null ? session.getHotelBranch().getId() : null)
                                .build();
        }
}