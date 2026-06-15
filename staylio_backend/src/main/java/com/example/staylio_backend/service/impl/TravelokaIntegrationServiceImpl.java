package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.service.TravelokaIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelokaIntegrationServiceImpl implements TravelokaIntegrationService {

    @Value("${traveloka.api.url:}")
    private String travelokaApiUrl;

    @Value("${traveloka.api.key:}")
    private String travelokaApiKey;

    @Override
    public void pushInventory(Room room, LocalDate date, int availableQuantity) {
        if (room.getTravelokaRoomId() == null || room.getHotelBranch().getTravelokaPropertyId() == null) {
            log.debug("Room {} is not mapped to Traveloka. Skipping inventory push.", room.getId());
            return;
        }

        // TODO: Gọi API Traveloka khi có tài liệu JSON cụ thể
        log.info("Mock: Đã gửi request lên Traveloka cập nhật phòng {}: ngày {} còn {} phòng.",
                room.getTravelokaRoomId(), date, availableQuantity);
    }

    @Override
    public void pushRate(Room room, LocalDate date, BigDecimal price) {
        if (room.getTravelokaRoomId() == null || room.getHotelBranch().getTravelokaPropertyId() == null) {
            log.debug("Room {} is not mapped to Traveloka. Skipping rate push.", room.getId());
            return;
        }

        // TODO: Gọi API Traveloka khi có tài liệu JSON cụ thể
        log.info("Mock: Đã gửi request lên Traveloka cập nhật giá phòng {}: ngày {} giá {}.",
                room.getTravelokaRoomId(), date, price);
    }
}
