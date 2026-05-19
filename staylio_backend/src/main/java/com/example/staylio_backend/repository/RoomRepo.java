package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
            @Param("roomId") Long roomId
    );
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
            @Param("roomId") Long roomId
    );

    List<Room> findAllByHotelBranch_Id(Long hotelBranchId);
}
