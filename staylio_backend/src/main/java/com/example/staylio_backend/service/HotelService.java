package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.common.base.BaseService;
import com.example.staylio_backend.model.enums.HotelStatus;

import java.util.List;

public interface HotelService extends BaseService<HotelRequest, HotelResponse, Long> {
    void updateStatus(Long id, HotelStatus status);

    void updateBulkActive(List<Long> ids, Boolean active);

    HotelResponse addHotel(HotelRequest hotelRequest, UserPrincipal userPrincipal);

    HotelResponse updateHotel(Long id, HotelRequest hotelRequest, UserPrincipal userPrincipal);

    HotelResponse getMyHotel(UserPrincipal userPrincipal);
}
