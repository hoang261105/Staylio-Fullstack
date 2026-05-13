package com.example.staylio_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkActiveRequest {
    private List<Long> ids;
    private Boolean active;
}
