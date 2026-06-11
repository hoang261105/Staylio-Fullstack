package com.example.staylio_backend.config.ai;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.RoomRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Function;

@Configuration
@RequiredArgsConstructor
public class AiFunctionConfig {

    private final RoomRepo roomRepo;

    public record RoomSearchRequest(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            RoomStatus status,
            Integer capacity
    ) {}

    public record RoomSearchDto(
            Long hotelId,
            Long branchId,
            Long roomId,
            String roomName,
            String roomNumber,
            String branchName,
            String hotelName,
            BigDecimal price,
            Integer capacity,
            RoomStatus status
    ) {}

    @Bean
    @Description("Tìm kiếm các phòng/khách sạn trong hệ thống dựa trên từ khóa (địa điểm, tên khách sạn), khoảng giá (minPrice, maxPrice), trạng thái phòng (truyền 'AVAILABLE'), hoặc sức chứa (capacity - số lượng người ở).")
    public Function<RoomSearchRequest, List<RoomSearchDto>> searchAvailableRoomsFunction() {
        return request -> {
            List<Room> rooms = roomRepo.searchRoomsForAI(
                    request.keyword(),
                    request.status(),
                    request.capacity(),
                    request.minPrice(),
                    request.maxPrice(),
                    PageRequest.of(0, 10)
            );

            return rooms.stream()
                    .map(room -> new RoomSearchDto(
                            room.getHotelBranch().getHotel().getId(),
                            room.getHotelBranch().getId(),
                            room.getId(),
                            room.getRoomName(),
                            room.getRoomNumber(),
                            room.getHotelBranch().getBranchName(),
                            room.getHotelBranch().getHotel().getName(),
                            room.getPrice(),
                            room.getCapacity(),
                            room.getStatus()
                    ))
                    .toList();
        };
    }
}
