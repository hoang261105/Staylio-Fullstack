package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.BranchStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BranchStatusRequest {
    private BranchStatus status;
}
