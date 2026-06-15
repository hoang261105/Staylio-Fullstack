package com.example.staylio_backend.service;

import com.example.staylio_backend.model.entity.Room;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface TravelokaIntegrationService {

    /**
     * Đồng bộ số lượng phòng trống lên Traveloka
     */
    void pushInventory(Room room, LocalDate date, int availableQuantity);

    /**
     * Đồng bộ giá phòng lên Traveloka
     */
    void pushRate(Room room, LocalDate date, BigDecimal price);
}
