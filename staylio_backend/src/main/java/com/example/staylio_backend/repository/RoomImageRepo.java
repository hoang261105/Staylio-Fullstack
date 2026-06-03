package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.RoomImage;
import com.example.staylio_backend.model.enums.ImageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomImageRepo extends JpaRepository<RoomImage, Long> {
    @Query("""
        select ri from RoomImage ri
        join ri.room r
        join r.hotelBranch hb
        join hb.hotel h
        join h.manager p
        where (:roomId is null or r.id = :roomId)
          and (:status is null or ri.status = :status)
          and (ri.status in ('PENDING', 'CONFIRMED', 'REJECTED'))
          and (
                :search is null
                or :search = ''
                or lower(r.roomName) like lower(concat('%', :search, '%'))
                or lower(r.roomNumber) like lower(concat('%', :search, '%'))
                or lower(p.fullName) like lower(concat('%', :search, '%'))
          )
    """)
    Page<RoomImage> searchImages(
            @Param("roomId") Long roomId,
            @Param("search") String search,
            @Param("status") ImageStatus status,
            Pageable pageable
    );
}
