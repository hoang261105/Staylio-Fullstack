package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ChatSessionRequest;
import com.example.staylio_backend.dto.response.ChatMessageResponse;
import com.example.staylio_backend.dto.response.ChatSessionResponse;
import com.example.staylio_backend.model.entity.ChatMessage;
import com.example.staylio_backend.model.entity.ChatSession;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.ChatIntent;
import com.example.staylio_backend.model.enums.ChatSessionStatus;
import com.example.staylio_backend.model.enums.ChatSessionType;
import com.example.staylio_backend.model.enums.MessageSenderType;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.ChatMessageRepo;
import com.example.staylio_backend.repository.ChatSessionRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.repository.RoomRepo;
import com.example.staylio_backend.service.ChatSessionService;
import com.example.staylio_backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatSessionServiceImpl implements ChatSessionService {

    private final ChatSessionRepo chatSessionRepo;
    private final ChatMessageRepo chatMessageRepo;
    private final ProfileRepo profileRepo;
    private final GeminiService geminiService;
    private final RoomRepo roomRepo;

    @Override
    public ChatSessionResponse createOrGetAiSession(UserPrincipal principal) {
        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        ChatSession session = chatSessionRepo
                .findFirstByUser_IdAndTypeAndStatus(
                        profile.getId(),
                        ChatSessionType.AI,
                        ChatSessionStatus.OPEN
                )
                .orElseGet(() -> chatSessionRepo.save(
                        ChatSession.builder()
                                .user(profile)
                                .manager(null)
                                .hotelBranch(null)
                                .room(null)
                                .type(ChatSessionType.AI)
                                .status(ChatSessionStatus.OPEN)
                                .build()
                ));

        return convertSessionToResponse(session);
    }

    @Override
    public ChatMessageResponse sendMessage(
            Long sessionId,
            ChatSessionRequest request,
            UserPrincipal principal
    ) {
        try {
            ChatSession session = chatSessionRepo.findById(sessionId)
                    .orElseThrow(() ->
                            new NoSuchElementException(ErrorCode.CHAT_SESSION_NOT_FOUND.getMessage())
                    );

            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() ->
                            new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage())
                    );

            if (!session.getUser().getId().equals(profile.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            if (session.getStatus() == ChatSessionStatus.CLOSED) {
                throw new AppException(ErrorCode.CHAT_SESSION_CLOSED);
            }

            ChatMessage userMessage = ChatMessage.builder()
                    .session(session)
                    .sender(profile)
                    .senderType(MessageSenderType.USER)
                    .content(request.getContent())
                    .isRead(true)
                    .build();

            chatMessageRepo.save(userMessage);

            String prompt = buildPrompt(request.getContent());

            String aiAnswer = geminiService.ask(prompt);

            ChatMessage aiMessage = ChatMessage.builder()
                    .session(session)
                    .sender(null)
                    .senderType(MessageSenderType.AI)
                    .content(aiAnswer)
                    .isRead(false)
                    .build();

            ChatMessage savedAiMessage = chatMessageRepo.save(aiMessage);

            return convertMessageToResponse(savedAiMessage);

        } catch (HttpClientErrorException.TooManyRequests ex) {
            throw new AppException(
                    ErrorCode.AI_QUOTA_EXCEEDED,
                    "AI hiện đã hết lượt miễn phí hoặc đang bị giới hạn, vui lòng thử lại sau."
            );
        }
    }

    @Override
    public List<ChatMessageResponse> getMessages(
            Long sessionId,
            UserPrincipal principal
    ) {
        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        ChatSession session = chatSessionRepo.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy đoạn chat!"));

        if (!session.getUser().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<ChatMessage> messages =
                chatMessageRepo.findAllBySession_IdOrderByCreatedAtAsc(sessionId);

        return messages.stream()
                .map(this::convertMessageToResponse)
                .toList();
    }

    private String buildPrompt(String userQuestion) {
        ChatIntent intent = detectIntent(userQuestion);

        BigDecimal minPrice = extractMinPrice(userQuestion);
        BigDecimal maxPrice = extractMaxPrice(userQuestion);
        String keyword = extractKeyword(userQuestion);

        RoomStatus status = null;

        if (intent == ChatIntent.ROOM_AVAILABILITY) {
            status = RoomStatus.AVAILABLE;
        }

        List<Room> rooms = roomRepo.searchRoomsForAI(
                keyword,
                status,
                minPrice,
                maxPrice,
                PageRequest.of(0, 10)
        );

        String roomContext = buildRoomContext(rooms);

        return """
                Bạn là trợ lý AI của hệ thống khách sạn Staylio.

                Quy tắc trả lời:
                - Chỉ trả lời dựa trên dữ liệu hệ thống được cung cấp.
                - Không tự bịa khách sạn, chi nhánh, phòng, giá hoặc trạng thái phòng.
                - Nếu không có dữ liệu phù hợp, hãy nói rõ chưa tìm thấy thông tin phù hợp trong hệ thống.
                - Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.
                - Nếu có danh sách phòng, hãy liệt kê tên phòng, chi nhánh, giá và sức chứa.

                Intent: %s
                Từ khóa tìm kiếm: %s
                Giá tối thiểu: %s
                Giá tối đa: %s
                Trạng thái phòng cần tìm: %s

                Dữ liệu phòng phù hợp:
                %s

                Câu hỏi khách hàng:
                %s
                """.formatted(
                intent,
                keyword != null ? keyword : "Không có",
                minPrice != null ? minPrice + " VNĐ" : "Không có",
                maxPrice != null ? maxPrice + " VNĐ" : "Không có",
                status != null ? status : "Không lọc",
                roomContext,
                userQuestion
        );
    }

    private ChatIntent detectIntent(String question) {
        if (question == null || question.isBlank()) {
            return ChatIntent.GENERAL;
        }

        String q = question.toLowerCase();

        if (q.contains("còn phòng")
                || q.contains("phòng trống")
                || q.contains("còn trống")
                || q.contains("available")) {
            return ChatIntent.ROOM_AVAILABILITY;
        }

        if (q.contains("giá")
                || q.contains("bao nhiêu")
                || q.contains("triệu")
                || q.contains("vnđ")
                || q.contains("vnd")
                || q.contains("đồng")) {
            return ChatIntent.ROOM_PRICE;
        }

        if (q.contains("phòng")
                || q.contains("room")
                || q.contains("chi nhánh")
                || q.contains("khách sạn")) {
            return ChatIntent.ROOM_SEARCH;
        }

        return ChatIntent.GENERAL;
    }

    private String buildRoomContext(List<Room> rooms) {
        if (rooms == null || rooms.isEmpty()) {
            return "Hiện chưa tìm thấy phòng phù hợp trong hệ thống.";
        }

        return rooms.stream()
                .map(room -> """
                        - Tên phòng: %s
                          Số phòng: %s
                          Chi nhánh: %s
                          Khách sạn: %s
                          Giá: %s VNĐ
                          Sức chứa: %s người
                          Trạng thái: %s
                        """.formatted(
                        room.getRoomName(),
                        room.getRoomNumber(),
                        room.getHotelBranch().getBranchName(),
                        room.getHotelBranch().getHotel().getName(),
                        room.getPrice(),
                        room.getCapacity(),
                        room.getStatus()
                ))
                .collect(Collectors.joining("\n"));
    }

    private BigDecimal extractMinPrice(String question) {
        if (question == null) {
            return null;
        }

        String q = question.toLowerCase();

        if (q.contains("trên 1 triệu")
                || q.contains("hơn 1 triệu")
                || q.contains("hon 1 trieu")) {
            return BigDecimal.valueOf(1_000_000);
        }

        if (q.contains("trên 2 triệu")
                || q.contains("hơn 2 triệu")
                || q.contains("hon 2 trieu")) {
            return BigDecimal.valueOf(2_000_000);
        }

        return null;
    }

    private BigDecimal extractMaxPrice(String question) {
        if (question == null) {
            return null;
        }

        String q = question.toLowerCase();

        if (q.contains("dưới 1 triệu")
                || q.contains("duoi 1 trieu")
                || q.contains("nhỏ hơn 1 triệu")
                || q.contains("ít hơn 1 triệu")) {
            return BigDecimal.valueOf(1_000_000);
        }

        if (q.contains("dưới 2 triệu")
                || q.contains("duoi 2 trieu")
                || q.contains("nhỏ hơn 2 triệu")
                || q.contains("ít hơn 2 triệu")) {
            return BigDecimal.valueOf(2_000_000);
        }

        return null;
    }

    private String extractKeyword(String question) {
        if (question == null || question.isBlank()) {
            return null;
        }

        String q = question.toLowerCase();

        q = q.replaceAll("[?.,!]", " ");

        q = q.replaceAll("\\b(có|không|cho tôi|tìm|kiếm|muốn|cần|xem|hỏi|giúp tôi|cho hỏi)\\b", " ");
        q = q.replaceAll("\\b(phòng|khách sạn|chi nhánh|ở|tại|giá|bao nhiêu|còn|trống|nào|loại|với)\\b", " ");

        q = q.replaceAll("\\b(dưới|trên|từ|đến|khoảng|tầm|nhỏ hơn|lớn hơn|ít hơn|nhiều hơn|hơn)\\b", " ");
        q = q.replaceAll("\\b(triệu|tr|k|nghìn|ngàn|vnd|vnđ|đồng)\\b", " ");

        q = q.replaceAll("\\d+(\\.\\d+)?", " ");

        q = q.replaceAll("\\s+", " ").trim();

        return q.isBlank() ? null : q;
    }

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

        return ChatSessionResponse.builder()
                .id(session.getId())
                .type(session.getType())
                .status(session.getStatus())
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .lastMessageAt(lastMessage != null ? lastMessage.getCreatedAt() : null)
                .unreadCount(0L)
                .createdAt(session.getCreatedAt())
                .build();
    }
}