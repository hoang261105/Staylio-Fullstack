package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.ApprovalStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprovalStatusRequest {
    private ApprovalStatus approvalStatus;
}
