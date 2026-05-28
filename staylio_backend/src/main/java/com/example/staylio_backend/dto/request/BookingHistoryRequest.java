package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingHistoryRequest {
    private String search;

    private BookingStatus status;

    private Integer page = 1;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String direction = "desc";
}
