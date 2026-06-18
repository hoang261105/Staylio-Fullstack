package com.example.staylio_backend.controller.mock;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock/traveloka")
public class TravelokaMockController {

    @PostMapping(value = "/v2/bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> mockCreateBooking() {
        String jsonResponse = "{\n" +
                "  \"data\": [\n" +
                "    {\n" +
                "      \"bookingId\": \"100160766\",\n" +
                "      \"bookingStatus\": \"ISSUED\",\n" +
                "      \"partnerBookingId\": \"1234567890\",\n" +
                "      \"itineraryId\": \"200000102216\",\n" +
                "      \"propertyId\": \"72900\",\n" +
                "      \"importantNotice\": \"There will be gala dinner on 31st Dec, and will be charged separately.\",\n" +
                "      \"hotelPolicy\": \"Check-in time is after 14:00, and check-out time is before 12:00.\",\n" +
                "      \"checkInInstruction\": \"Married couple must show marriage certificate upon check-in.\",\n" +
                "      \"checkInDate\": \"2024-01-01\",\n" +
                "      \"checkOutDate\": \"2024-01-02\",\n" +
                "      \"rooms\": [\n" +
                "        {\n" +
                "          \"roomId\": \"1000066445\",\n" +
                "          \"roomName\": \"Deluxe Room\",\n" +
                "          \"guestInfo\": [\n" +
                "            {\n" +
                "              \"title\": \"MR\",\n" +
                "              \"firstName\": \"John\",\n" +
                "              \"lastName\": \"Doe\"\n" +
                "            }\n" +
                "          ]\n" +
                "        }\n" +
                "      ],\n" +
                "      \"extraCharges\": [\n" +
                "        {\n" +
                "          \"name\": \"COUNTRY_TAX_ADJUSTMENT\",\n" +
                "          \"currency\": \"USD\",\n" +
                "          \"value\": \"12.1\",\n" +
                "          \"isIncluded\": false\n" +
                "        }\n" +
                "      ],\n" +
                "      \"cancellationId\": \"1234567890\",\n" +
                "      \"cancellationSubmissionTime\": \"2023-07-26T10:00:00+0700\",\n" +
                "      \"cancellationStatus\": {\n" +
                "        \"status\": \"SUBMITTED\"\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"error\": {\n" +
                "    \"code\": \"\",\n" +
                "    \"message\": \"\",\n" +
                "    \"requestId\": \"\"\n" +
                "  }\n" +
                "}";

        return ResponseEntity.ok(jsonResponse);
    }

    @PostMapping(value = "/v2/bookings/cancellation/submit", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> mockCancelBooking() {
        String jsonResponse = "{\n" +
                "  \"data\": {\n" +
                "    \"bookingId\": \"100160766\",\n" +
                "    \"cancellationId\": \"1234567890\",\n" +
                "    \"cancellationSubmissionTime\": \"2023-07-26T10:00:00+0700\",\n" +
                "    \"cancellationStatus\": {\n" +
                "      \"status\": \"SUBMITTED\"\n" +
                "    }\n" +
                "  },\n" +
                "  \"error\": {\n" +
                "    \"code\": \"\",\n" +
                "    \"message\": \"\",\n" +
                "    \"requestId\": \"\"\n" +
                "  }\n" +
                "}";

        return ResponseEntity.ok(jsonResponse);
    }
}
