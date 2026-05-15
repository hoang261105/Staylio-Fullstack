package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
    boolean existsByRoomNameAndHotelBranch_IdAndIdNot(String roomName, Long hotelBranchId, Long id);

    boolean existsByRoomNumberAndHotelBranch_Id(String roomNumber, Long hotelBranchId);
    boolean existsByRoomNumberAndHotelBranch_IdAndIdNot(String roomNumber, Long hotelBranchId, Long id);
}
