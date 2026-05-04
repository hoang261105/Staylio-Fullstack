package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.common.base.BaseService;
import com.example.staylio_backend.model.enums.HotelStatus;

public interface HotelService extends BaseService<HotelRequest, HotelResponse, Long> {
    void updateStatus(Long id, HotelStatus status);
}
