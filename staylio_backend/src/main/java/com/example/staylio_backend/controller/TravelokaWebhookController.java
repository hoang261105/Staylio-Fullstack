package com.example.staylio_backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.staylio_backend.dto.response.ApiResponse;

import com.example.staylio_backend.service.TravelokaIntegrationService;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks/traveloka")
@RequiredArgsConstructor
@Slf4j
public class TravelokaWebhookController {

    private final TravelokaIntegrationService travelokaIntegrationService;

    @PostMapping("/booking")
    public ResponseEntity<ApiResponse<Object>> handleBookingWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Nhận được Webhook đặt phòng từ Traveloka: {}", payload);
        travelokaIntegrationService.processWebhookBooking(payload);

        ApiResponse<Object> response = new ApiResponse<>(
                true,
                "Webhook received and processed successfully",
                null,
                null,
                LocalDateTime.now());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Nhận Webhook từ Traveloka khi khách hủy phòng trên app của họ.
     */
    @PostMapping("/cancellation")
    public ResponseEntity<ApiResponse<Object>> handleCancellationWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Nhận được Webhook hủy phòng từ Traveloka: {}", payload);
        ApiResponse<Object> response = new ApiResponse<>(true, "Webhook received successfully", null, null,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
