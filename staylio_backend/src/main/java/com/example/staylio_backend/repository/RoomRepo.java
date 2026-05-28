package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {
    @Query("""
                SELECT r from Room r
                WHERE (:hotelBranchId IS NULL OR r.hotelBranch.id = :hotelBranchId)
                    AND (:search IS NULL OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%')))
                    AND (:status IS NULL OR r.status = :status)
            """)
    Page<Room> searchRooms(Long hotelBranchId, String search, RoomStatus status, Pageable pageable);

    @Query("""
                SELECT r from Room r
                WHERE (:search IS NULL OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%')))
                    AND (:status IS NULL OR r.status = :status)
            """)
    Page<Room> findAllRooms(String search, RoomStatus status, Pageable pageable);

    @Query("""
                SELECT r
                FROM Room r
                JOIN r.hotelBranch hb
                JOIN hb.hotel h
                WHERE h.manager.id = :managerId
                  AND (:status IS NULL OR r.status = :status)
                  AND (
                        :search IS NULL
                        OR :search = ''
                        OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<Room> findAllRoomsByManager(
            @Param("managerId") Long managerId,
            @Param("search") String search,
            @Param("status") RoomStatus status,
            Pageable pageable);

    boolean existsByRoomNameAndHotelBranch_Id(String roomName, Long hotelBranchId);

    boolean existsByRoomNumberAndHotelBranch_Id(String roomName, Long hotelBranchId);

    @Query("""
                SELECT COUNT(r) > 0
                FROM Room r
                WHERE LOWER(TRIM(r.roomName)) = LOWER(TRIM(:roomName))
                  AND r.hotelBranch.id = :hotelBranchId
                  AND r.id <> :roomId
            """)
    boolean existsDuplicateRoomNameForUpdate(
            @Param("roomName") String roomName,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("roomId") Long roomId);

    @Query("""
                SELECT COUNT(r) > 0
                FROM Room r
                WHERE LOWER(TRIM(r.roomNumber)) = LOWER(TRIM(:roomNumber))
                  AND r.hotelBranch.id = :hotelBranchId
                  AND r.id <> :roomId
            """)
    boolean existsDuplicateRoomNumberForUpdate(
            @Param("roomNumber") String roomNumber,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("roomId") Long roomId);

    List<Room> findAllByHotelBranch_Id(Long hotelBranchId);

    @Query("""
                SELECT r
                FROM Room r
                JOIN r.hotelBranch hb
                JOIN hb.hotel h
                WHERE r.isActive = true
                  AND (:status IS NULL OR r.status = :status)
                  AND (:minPrice IS NULL OR r.price >= :minPrice)
                  AND (:maxPrice IS NULL OR r.price <= :maxPrice)
                  AND (
                        :search IS NULL
                        OR :search = ''
                        OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    List<Room> searchRoomsForAI(
            @Param("search") String search,
            @Param("status") RoomStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("""
                SELECT COUNT(r)
                FROM Review r
                WHERE r.room.id = :roomId
                  AND r.status = 'VISIBLE'
                  AND r.isDeleted = false
            """)
    Long countReviewsByRoomId(@Param("roomId") Long roomId);

    @Query("""
                SELECT COALESCE(AVG(r.rating), 0)
                FROM Review r
                WHERE r.room.id = :roomId
                  AND r.status = 'VISIBLE'
                  AND r.isDeleted = false
            """)
    Double averageRatingByRoomId(@Param("roomId") Long roomId);

    @Query("""
                SELECT DISTINCT r
                FROM Room r
                JOIN r.hotelBranch hb
                JOIN hb.hotel h
                JOIN hb.ward w
                JOIN w.province p
                LEFT JOIN Review rv
                    ON rv.room.id = r.id
                    AND rv.status = 'VISIBLE'
                    AND rv.isDeleted = false
                WHERE r.isActive = true
                AND (:status IS NULL OR r.status = :status)

                AND (
                        :keyword IS NULL
                        OR :keyword = ''
                        OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(w.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(p.province) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )

                AND (:adults IS NULL OR r.maxAdults >= :adults)
                AND (:children IS NULL OR r.maxChildren >= :children)
                AND (:capacity IS NULL OR r.capacity >= :capacity)

                AND (:minPrice IS NULL OR r.price >= :minPrice)
                AND (:maxPrice IS NULL OR r.price <= :maxPrice)

                AND (
                        :checkInDate IS NULL
                        OR :checkOutDate IS NULL
                        OR NOT EXISTS (
                            SELECT b
                            FROM Booking b
                            WHERE b.room.id = r.id
                            AND b.status NOT IN (
                                com.example.staylio_backend.model.enums.BookingStatus.CANCELLED,
                                com.example.staylio_backend.model.enums.BookingStatus.REFUNDED
                            )
                            AND b.checkInDate < :checkOutDate
                            AND b.checkOutDate > :checkInDate
                        )
                )

                GROUP BY r.id

                HAVING (
                    :minRating IS NULL
                    OR COALESCE(AVG(rv.rating), 0) >= :minRating
                )
            """)
    Page<Room> searchAvailableRooms(
            @Param("keyword") String keyword,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("status") RoomStatus status,
            @Param("adults") Integer adults,
            @Param("children") Integer children,
            @Param("capacity") Integer capacity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            Pageable pageable);
}
