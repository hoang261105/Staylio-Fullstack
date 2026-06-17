package com.example.staylio_backend.repository;

import com.example.staylio_backend.dto.response.DateRangeResponse;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
        @Query("""
                            SELECT DISTINCT b FROM Booking b
                            LEFT JOIN b.payments p
                            LEFT JOIN b.userVoucher uv
                            LEFT JOIN uv.voucher v
                            JOIN b.user u
                            JOIN b.room r
                            JOIN r.hotelBranch hb
                            JOIN hb.hotel h
                            WHERE h.manager.id = :managerId
                              AND (:status IS NULL OR b.status = :status)
                              AND (:paymentStatus IS NULL OR p.status = :paymentStatus)
                              AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
                              AND (:checkInFrom IS NULL OR b.checkInDate >= :checkInFrom)
                              AND (:checkInTo IS NULL OR b.checkInDate <= :checkInTo)
                              AND (:checkOutFrom IS NULL OR b.checkOutDate >= :checkOutFrom)
                              AND (:checkOutTo IS NULL OR b.checkOutDate <= :checkOutTo)
                              AND (
                                    :search IS NULL
                                    OR :search = ''
                                    OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(v.code) LIKE LOWER(CONCAT('%', :search, '%'))
                              )
                        """)
        Page<Booking> searchBookingsByManager(
                        @Param("managerId") Long managerId,
                        @Param("search") String search,
                        @Param("status") BookingStatus status,
                        @Param("paymentStatus") PaymentStatus paymentStatus,
                        @Param("hotelBranchId") Long hotelBranchId,
                        @Param("checkInFrom") LocalDate checkInFrom,
                        @Param("checkInTo") LocalDate checkInTo,
                        @Param("checkOutFrom") LocalDate checkOutFrom,
                        @Param("checkOutTo") LocalDate checkOutTo,
                        Pageable pageable);

        @Query("""
                            SELECT DISTINCT b
                            FROM Booking b
                            LEFT JOIN b.payments p
                            LEFT JOIN b.userVoucher uv
                            LEFT JOIN uv.voucher v
                            JOIN b.user u
                            JOIN b.room r
                            JOIN r.hotelBranch hb
                            WHERE (:search IS NULL
                                   OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
                                   OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
                                   OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                                   OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
                                   OR LOWER(v.code) LIKE LOWER(CONCAT('%', :search, '%'))
                                   OR LOWER(p.transactionId) LIKE LOWER(CONCAT('%', :search, '%'))
                            )
                              AND (:status IS NULL OR b.status = :status)
                              AND (:paymentStatus IS NULL OR p.status = :paymentStatus)
                              AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
                              AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
                              AND (:roomId IS NULL OR r.id = :roomId)
                              AND (:userId IS NULL OR u.id = :userId)
                              AND (:checkInFrom IS NULL OR b.checkInDate >= :checkInFrom)
                              AND (:checkInTo IS NULL OR b.checkInDate <= :checkInTo)
                              AND (:checkOutFrom IS NULL OR b.checkOutDate >= :checkOutFrom)
                              AND (:checkOutTo IS NULL OR b.checkOutDate <= :checkOutTo)
                        """)
        Page<Booking> searchBookings(
                        @Param("search") String search,
                        @Param("status") BookingStatus status,
                        @Param("paymentStatus") PaymentStatus paymentStatus,
                        @Param("paymentMethod") PaymentMethod paymentMethod,
                        @Param("hotelBranchId") Long hotelBranchId,
                        @Param("roomId") Long roomId,
                        @Param("userId") Long userId,
                        @Param("checkInFrom") LocalDate checkInFrom,
                        @Param("checkInTo") LocalDate checkInTo,
                        @Param("checkOutFrom") LocalDate checkOutFrom,
                        @Param("checkOutTo") LocalDate checkOutTo,
                        Pageable pageable);

        List<Booking> findByStatusAndExpectedCheckOutAtIsNotNullAndExpectedCheckOutAtLessThanEqual(
                        BookingStatus status,
                        LocalDateTime expectedCheckOutAt);

        @Query("""
                            SELECT COUNT(b) > 0
                            FROM Booking b
                            WHERE b.room.id = :roomId
                              AND b.status NOT IN (
                                  'CANCELLED', 'REFUNDED'
                              )
                              AND b.checkInDate < :checkOutDate
                              AND b.checkOutDate > :checkInDate
                        """)
        boolean existsOverlappingBooking(
                        @Param("roomId") Long roomId,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);

        @Query("""
                            SELECT new com.example.staylio_backend.dto.response.DateRangeResponse(b.checkInDate, b.checkOutDate)
                            FROM Booking b
                            WHERE b.room.id = :roomId
                              AND b.status NOT IN ('CANCELLED', 'REFUNDED')
                              AND b.checkOutDate >= CURRENT_DATE
                        """)
        List<DateRangeResponse> findBookedDatesByRoomId(@Param("roomId") Long roomId);

        @Query("""
                            SELECT b
                            FROM Booking b
                            LEFT JOIN FETCH b.payments p
                            JOIN b.room r
                            JOIN r.hotelBranch hb
                            WHERE b.user.id = :userId
                              AND (
                                    :search IS NULL
                                    OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
                              )
                              AND (:status IS NULL OR b.status = :status)
                        """)
        Page<Booking> searchBookingsByUser(
                        Long userId,
                        String search,
                        BookingStatus status,
                        Pageable pageable);

        @Query("""
                            SELECT COUNT(b)
                            FROM Booking b
                            JOIN b.room r
                            JOIN r.hotelBranch hb
                            WHERE hb.hotel.id = :hotelId
                              AND b.status IN :statuses
                              AND b.checkInDate >= CURRENT_DATE
                        """)
        long countFutureActiveBookingsByHotelId(
                        @Param("hotelId") Long hotelId,
                        @Param("statuses") List<BookingStatus> statuses);

        @Query("""
            SELECT COALESCE(SUM(b.adults + b.children), 0)
            FROM Booking b
            JOIN b.room r
            JOIN r.hotelBranch hb
            JOIN hb.hotel h
            WHERE h.manager.id = :managerId
              AND b.status =
                  com.example.staylio_backend.model.enums.BookingStatus.CHECKED_IN
        """)
        Long countStayingGuests(
                @Param("managerId") Long managerId
        );

        @Query("""
            SELECT COUNT(b)
            FROM Booking b
            JOIN b.room r
            JOIN r.hotelBranch hb
            JOIN hb.hotel h
            WHERE h.manager.id = :managerId
              AND b.createdAt >= :fromDate
        """)
        Long countNewBookings(
                @Param("managerId") Long managerId,
                @Param("fromDate") LocalDateTime fromDate
        );

        @Query("""
            SELECT COALESCE(SUM(b.finalPrice), 0)
            FROM Booking b
            JOIN b.room r
            JOIN r.hotelBranch hb
            JOIN hb.hotel h
            WHERE h.manager.id = :managerId
              AND b.status IN (
                  com.example.staylio_backend.model.enums.BookingStatus.CONFIRMED,
                  com.example.staylio_backend.model.enums.BookingStatus.CHECKED_IN,
                  com.example.staylio_backend.model.enums.BookingStatus.CHECKED_OUT
              )
        """)
        BigDecimal calculateEstimatedRevenue(
                @Param("managerId") Long managerId
        );

        long countByUserId(Long userId);

        @Query("SELECT b FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
        List<Booking> findBookingsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
