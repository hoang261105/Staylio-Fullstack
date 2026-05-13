package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkStatusRequest {
    private List<Long> ids;
    private UserStatus status;
}
