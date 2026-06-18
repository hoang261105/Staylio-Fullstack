package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.service.TravelokaIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.BookingSource;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.repository.BookingRepo;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.repository.RoleRepo;
import com.example.staylio_backend.repository.RoomRepo;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelokaIntegrationServiceImpl implements TravelokaIntegrationService {

    @Value("${traveloka.api.url:}")
    private String travelokaApiUrl;

    @Value("${traveloka.api.key:}")
    private String travelokaApiKey;

    private final RoomRepo roomRepo;
    private final BookingRepo bookingRepo;
    private final AccountRepo accountRepo;
    private final RoleRepo roleRepo;
    private final PaymentRepo paymentRepo;

    @Override
    public void pushInventory(Room room, LocalDate date, int availableQuantity) {
        if (room.getTravelokaRoomId() == null || room.getHotelBranch().getTravelokaPropertyId() == null) {
            log.debug("Room {} is not mapped to Traveloka. Skipping inventory push.", room.getId());
            return;
        }

        log.info("Mock: Đã gửi request lên Traveloka cập nhật phòng {}: ngày {} còn {} phòng.",
                room.getTravelokaRoomId(), date, availableQuantity);
    }

    @Override
    public void pushRate(Room room, LocalDate date, BigDecimal price) {
        if (room.getTravelokaRoomId() == null || room.getHotelBranch().getTravelokaPropertyId() == null) {
            log.debug("Room {} is not mapped to Traveloka. Skipping rate push.", room.getId());
            return;
        }

        log.info("Mock: Đã gửi request lên Traveloka cập nhật giá phòng {}: ngày {} giá {}.",
                room.getTravelokaRoomId(), date, price);
    }

    @SuppressWarnings("unchecked")
    @Override
    public void processWebhookBooking(Map<String, Object> payload) {
        try {
            List<Map<String, Object>> dataList = (List<Map<String, Object>>) payload.get("data");
            if (dataList == null || dataList.isEmpty()) {
                log.warn("Webhook payload does not contain data array");
                return;
            }

            Map<String, Object> data = dataList.get(0);
            String externalBookingId = (String) data.get("bookingId");
            String checkInDateStr = (String) data.get("checkInDate");
            String checkOutDateStr = (String) data.get("checkOutDate");

            List<Map<String, Object>> roomsList = (List<Map<String, Object>>) data.get("rooms");
            if (roomsList == null || roomsList.isEmpty()) {
                log.warn("Webhook payload does not contain rooms");
                return;
            }

            Map<String, Object> roomData = roomsList.get(0);
            String travelokaRoomId = (String) roomData.get("roomId");

            List<Map<String, Object>> guestInfoList = (List<Map<String, Object>>) roomData.get("guestInfo");
            String guestFirstName = "Guest";
            String guestLastName = "";
            if (guestInfoList != null && !guestInfoList.isEmpty()) {
                Map<String, Object> guestInfo = guestInfoList.get(0);
                guestFirstName = (String) guestInfo.getOrDefault("firstName", "Guest");
                guestLastName = (String) guestInfo.getOrDefault("lastName", "");
            }

            // Tìm phòng tương ứng trong hệ thống
            Room room = roomRepo.findByTravelokaRoomId(travelokaRoomId)
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy phòng liên kết với Traveloka Room ID: " + travelokaRoomId));

            // Tạo biến final để dùng trong lambda
            final String finalGuestFirstName = guestFirstName;
            final String finalGuestLastName = guestLastName;

            // Tìm hoặc tạo User
            String guestEmail = externalBookingId + "@guest.traveloka.com"; // Giả lập email duy nhất cho guest
                                                                            // Traveloka
            User guestUser = accountRepo.findByEmail(guestEmail).orElseGet(() -> {
                User newUser = User.builder()
                        .email(guestEmail)
                        .userName("traveloka_" + externalBookingId)
                        .status(UserStatus.ACTIVE)
                        .role(roleRepo.findByRoleName(RoleName.ROLE_CUSTOMER))
                        .isEmailVerified(true)
                        .build();

                Profile profile = Profile.builder()
                        .fullName(finalGuestFirstName + " " + finalGuestLastName)
                        .dateOfBirth(LocalDate.of(1990, 1, 1)) // Default DOB for guest
                        .user(newUser)
                        .build();
                newUser.setProfile(profile);

                return accountRepo.save(newUser);
            });

            // Tính toán giá phòng
            LocalDate checkIn = LocalDate.parse(checkInDateStr);
            LocalDate checkOut = LocalDate.parse(checkOutDateStr);
            long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
            if (nights <= 0) nights = 1;

            BigDecimal roomPrice = room.getPrice() != null ? room.getPrice() : BigDecimal.ZERO;
            BigDecimal totalPrice = roomPrice.multiply(BigDecimal.valueOf(nights));

            // Tạo Booking
            Booking booking = Booking.builder()
                    .user(guestUser)
                    .room(room)
                    .checkInDate(checkIn)
                    .checkOutDate(checkOut)
                    .adults(2) // Default if not provided
                    .children(0)
                    .originalPrice(totalPrice) // Đã cập nhật giá
                    .finalPrice(totalPrice)
                    .status(BookingStatus.CONFIRMED)
                    .bookingSource(BookingSource.TRAVELOKA)
                    .externalBookingId(externalBookingId)
                    .bookingCode("TVLK-" + externalBookingId)
                    .confirmedAt(LocalDateTime.now())
                    .build();

            booking = bookingRepo.save(booking);

            // Tạo Payment (Báo là đã thanh toán cho Traveloka)
            Payment payment = Payment.builder()
                    .booking(booking)
                    .paymentMethod(PaymentMethod.TRAVELOKA)
                    .amount(totalPrice)
                    .status(PaymentStatus.PAID)
                    .paidAt(LocalDateTime.now())
                    .transactionId(externalBookingId)
                    .build();
            paymentRepo.save(payment);

            log.info("Lưu thành công Booking từ Traveloka vào database: {} với giá {}", booking.getBookingCode(), totalPrice);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý Webhook Traveloka: ", e);
            throw new RuntimeException("Error processing Traveloka Webhook", e);
        }
    }
}
