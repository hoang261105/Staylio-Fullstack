package com.example.staylio_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DateRangeResponse {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
