package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusRequest {
    private BookingStatus status;
    private String cancellationReason;
}
