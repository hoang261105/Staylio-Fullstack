package com.example.staylio_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyBookingResponse {
    private String dayOfWeek;
    private long confirmed;
    private long pending;
}
