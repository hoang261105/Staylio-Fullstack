package com.example.staylio_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ZaloPayCreateOrderResponse {
    private String appTransId;
    private String paymentUrl;
    private String rawResponse;
}
