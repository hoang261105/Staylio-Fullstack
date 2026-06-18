package com.example.staylio_backend.service;

import com.example.staylio_backend.model.entity.Room;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public interface TravelokaIntegrationService {

    void pushInventory(Room room, LocalDate date, int availableQuantity);

    void pushRate(Room room, LocalDate date, BigDecimal price);

    void processWebhookBooking(Map<String, Object> payload);
}
