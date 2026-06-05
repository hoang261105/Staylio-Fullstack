package com.example.staylio_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartManagerChatRequest {
    private Long hotelBranchId;
    private Long roomId;
}
