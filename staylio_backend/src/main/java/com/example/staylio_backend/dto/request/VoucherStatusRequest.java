package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.VoucherStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherStatusRequest {
    private VoucherStatus status;
}
