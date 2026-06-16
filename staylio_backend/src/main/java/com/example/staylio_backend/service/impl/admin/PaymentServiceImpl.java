package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.ZaloPayProperties;
import com.example.staylio_backend.config.payment.VNPayProperties;
import com.example.staylio_backend.common.utils.VNPayUtil;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.PaymentFilterRequest;
import com.example.staylio_backend.dto.request.PaymentStatusRequest;
import com.example.staylio_backend.dto.response.PaymentResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.PayPalService;
import com.example.staylio_backend.service.PaymentService;
import com.example.staylio_backend.service.ZaloPayService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepo paymentRepo;
    private final ProfileRepo profileRepo;
    private final ZaloPayProperties zaloPayProperties;
    private final ObjectMapper objectMapper;
    private final ZaloPayService zaloPayService;
    private final PayPalService payPalService;
    private final VNPayProperties vnPayProperties;

    @Override
    public PaginationResponse<PaymentResponse> getAllPayments(PaymentFilterRequest request, UserPrincipal principal) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(
                page,
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection()));

        String search = request.getSearch();
        search = (search == null || search.isBlank()) ? null : search.trim();

        Page<Payment> paymentPage;

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            paymentPage = paymentRepo.searchPayments(
                    search,
                    request.getStatus(),
                    request.getPaymentMethod(),
                    request.getHotelBranchId(),
                    request.getPaidFrom(),
                    request.getPaidTo(),
                    request.getCreatedFrom(),
                    request.getCreatedTo(),
                    request.getMinAmount(),
                    request.getMaxAmount(),
                    pageable);
        } else if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

            paymentPage = paymentRepo.searchPaymentsByManager(
                    profile.getId(),
                    search,
                    request.getStatus(),
                    request.getPaymentMethod(),
                    request.getHotelBranchId(),
                    request.getPaidFrom(),
                    request.getPaidTo(),
                    request.getCreatedFrom(),
                    request.getCreatedTo(),
                    request.getMinAmount(),
                    request.getMaxAmount(),
                    pageable);
        } else if (principal.hasRole(RoleName.ROLE_CUSTOMER)) {

            paymentPage = paymentRepo.searchPaymentsByUser(
                    principal.getId(),
                    request.getStatus(),
                    request.getPaymentMethod(),
                    pageable);

        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<PaymentResponse> content = paymentPage.getContent()
                .stream()
                .map(this::convertToResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                paymentPage.getNumber() + 1,
                paymentPage.getSize(),
                paymentPage.getTotalPages(),
                paymentPage.getTotalElements());

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public PaymentResponse getByBookingId(Long bookingId) {
        Payment payment = paymentRepo.findByBooking_Id(bookingId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        return convertToResponse(payment);
    }

    @Override
    @Transactional
    public void updateStatus(Long paymentId, PaymentStatusRequest request) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        PaymentStatus newPaymentStatus = request.getPaymentStatus();
        BookingStatus newBookingStatus = request.getBookingStatus();

        if (newPaymentStatus == null) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS);
        }

        if (newBookingStatus == null) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        Booking booking = payment.getBooking();

        validatePaymentTransition(payment, newPaymentStatus);
        validateBookingPaymentMatch(newPaymentStatus, newBookingStatus);
        validateBookingCanUpdatePayment(booking);

        payment.setStatus(newPaymentStatus);

        if (newPaymentStatus == PaymentStatus.PAID) {
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment.setPaidAt(null);
        }

        booking.setStatus(newBookingStatus);

        paymentRepo.save(payment);
    }

    @Override
    @Transactional
    public Map<String, Object> handleZaloPayCallback(Map<String, Object> body) {
        try {
            String data = body.get("data").toString();
            String reqMac = body.get("mac").toString();

            String mac = zaloPayService.hmacSha256(data, zaloPayProperties.getKey2());

            if (!mac.equals(reqMac)) {
                return Map.of(
                        "return_code", -1,
                        "return_message", "Invalid MAC");
            }

            JsonNode dataNode = objectMapper.readTree(data);

            String appTransId = dataNode.get("app_trans_id").asText();
            String zpTransId = dataNode.get("zp_trans_id").asText();

            Payment payment = paymentRepo.findByGatewayOrderId(appTransId)
                    .orElseThrow(() -> new NoSuchElementException(
                            ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

            payment.setTransactionId(zpTransId);
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            payment.setRawResponse(objectMapper.writeValueAsString(body));

            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());

            paymentRepo.save(payment);

            return Map.of(
                    "return_code", 1,
                    "return_message", "success");

        } catch (Exception e) {
            return Map.of(
                    "return_code", 0,
                    "return_message", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handlePayPalCapture(String token, Long bookingId) {
        Payment payment = paymentRepo.findByBooking_Id(bookingId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        // Capture payment via PayPal Service
        Map<String, Object> captureResponse = payPalService.captureOrder(token);

        String status = (String) captureResponse.get("status");

        if ("COMPLETED".equals(status)) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());

            try {
                payment.setRawResponse(objectMapper.writeValueAsString(captureResponse));
            } catch (Exception e) {
                // ignore
            }

            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());

            paymentRepo.save(payment);
        } else {
            throw new AppException(ErrorCode.PAYMENT_FAILED);
        }
    }

    @Override
    @Transactional
    public void handlePayPalCancel(String token, Long bookingId) {
        Payment payment = paymentRepo.findByBooking_Id(bookingId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        payment.setStatus(PaymentStatus.CANCELLED);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason("Customer cancelled PayPal payment");
        booking.setCancelledAt(LocalDateTime.now());

        paymentRepo.save(payment);
    }

    @Override
    @Transactional
    public void handleVNPayCallback(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    hashData.append(fieldValue);
                }
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String signValue = VNPayUtil.hmacSHA512(vnPayProperties.getHashSecret(), hashData.toString());

        if (!signValue.equals(vnp_SecureHash)) {
            throw new AppException(ErrorCode.PAYMENT_FAILED);
        }

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String bankCode = params.get("vnp_BankCode");

        String bookingCode = txnRef.split("_")[0];

        Payment payment = paymentRepo.findByBooking_BookingCode(bookingCode)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        if ("00".equals(responseCode)) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            payment.setTransactionId(params.get("vnp_TransactionNo"));

            try {
                payment.setRawResponse(objectMapper.writeValueAsString(params));
            } catch (Exception e) {
                // ignore
            }

            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());

            paymentRepo.save(payment);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancellationReason("VNPay payment failed. Code: " + responseCode);
            booking.setCancelledAt(LocalDateTime.now());
            paymentRepo.save(payment);
        }
    }

    private Sort getSort(String sortBy, String direction) {
        Sort.Direction dir = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String safeSortBy = sortBy == null || sortBy.isBlank()
                ? "createdAt"
                : sortBy;

        String property = switch (safeSortBy) {
            case "paidAt" -> "paidAt";
            case "amount" -> "amount";
            case "status" -> "status";
            case "paymentMethod" -> "paymentMethod";
            case "createdAt" -> "createdAt";
            default -> "createdAt";
        };

        return Sort.by(dir, property);
    }

    private PaymentResponse convertToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking().getId(),
                payment.getBooking().getBookingCode(),
                payment.getPaymentMethod(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidAt(),
                payment.getCreatedAt());
    }

    private void validatePaymentTransition(
            Payment payment,
            PaymentStatus newStatus) {
        PaymentStatus currentStatus = payment.getStatus();

        if (currentStatus == PaymentStatus.PAID) {
            if (newStatus == PaymentStatus.PENDING) {
                throw new AppException(ErrorCode.CANNOT_UPDATE_PAID_PAYMENT_TO_PENDING);
            }

            if (newStatus == PaymentStatus.CANCELLED) {
                throw new AppException(ErrorCode.CANNOT_CANCEL_PAID_PAYMENT);
            }
        }

        if (currentStatus == PaymentStatus.CANCELLED) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_CANCELLED);
        }

        if (currentStatus == PaymentStatus.REFUNDED) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_REFUNDED);
        }

        if (newStatus == PaymentStatus.REFUNDED
                && currentStatus != PaymentStatus.PAID) {
            throw new AppException(ErrorCode.CANNOT_REFUND_UNPAID_PAYMENT);
        }
    }

    private void validateBookingPaymentMatch(
            PaymentStatus paymentStatus,
            BookingStatus bookingStatus) {
        switch (paymentStatus) {
            case PAID -> {
                if (bookingStatus != BookingStatus.PAID
                        && bookingStatus != BookingStatus.CONFIRMED) {
                    throw new AppException(ErrorCode.BOOKING_PAYMENT_STATUS_NOT_MATCH);
                }
            }

            case PENDING -> {
                if (bookingStatus != BookingStatus.PENDING_PAYMENT) {
                    throw new AppException(ErrorCode.BOOKING_PAYMENT_STATUS_NOT_MATCH);
                }
            }

            case FAILED -> {
                if (bookingStatus != BookingStatus.PENDING_PAYMENT
                        && bookingStatus != BookingStatus.CANCELLED) {
                    throw new AppException(ErrorCode.BOOKING_PAYMENT_STATUS_NOT_MATCH);
                }
            }

            case CANCELLED -> {
                if (bookingStatus != BookingStatus.CANCELLED) {
                    throw new AppException(ErrorCode.BOOKING_PAYMENT_STATUS_NOT_MATCH);
                }
            }

            case REFUNDED -> {
                if (bookingStatus != BookingStatus.REFUNDED
                        && bookingStatus != BookingStatus.CANCELLED) {
                    throw new AppException(ErrorCode.BOOKING_PAYMENT_STATUS_NOT_MATCH);
                }
            }
        }
    }

    private void validateBookingCanUpdatePayment(Booking booking) {
        if (booking.getStatus() == BookingStatus.CHECKED_IN) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CHECKED_IN);
        }

        if (booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CHECKED_OUT);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }

        if (booking.getStatus() == BookingStatus.REFUNDED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_REFUNDED);
        }
    }
}
