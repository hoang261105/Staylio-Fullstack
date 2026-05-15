package com.example.staylio_backend.service;

import com.example.staylio_backend.common.base.BaseService;
import com.example.staylio_backend.dto.request.UtilityRequest;
import com.example.staylio_backend.dto.response.UtilityResponse;

import java.util.List;

public interface UtilityService extends BaseService<UtilityRequest, UtilityResponse, Long>{
    List<UtilityResponse> getAllUtilities();
}
