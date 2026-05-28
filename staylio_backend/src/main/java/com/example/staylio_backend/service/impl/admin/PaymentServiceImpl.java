package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.PaymentFilterRequest;
import com.example.staylio_backend.dto.response.PaymentResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.PaymentStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepo paymentRepo;
    private final ProfileRepo profileRepo;

    @Override
    public PaginationResponse<PaymentResponse> getAllPayments(PaymentFilterRequest request, UserPrincipal principal) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(
                page,
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection())
        );

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
                    pageable
            );
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
                    pageable
            );
        } else if (principal.hasRole(RoleName.ROLE_CUSTOMER)) {

            paymentPage = paymentRepo.searchPaymentsByUser(
                    principal.getId(),
                    request.getStatus(),
                    request.getPaymentMethod(),
                    pageable
            );

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
                paymentPage.getTotalElements()
        );

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public PaymentResponse getByBookingId(Long bookingId) {
        Payment payment = paymentRepo.findByBooking_Id(bookingId).orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        return convertToResponse(payment);
    }

    @Override
    public void updateStatus(Long paymentId, PaymentStatus status) {

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
                payment.getCreatedAt()
        );
    }
}
