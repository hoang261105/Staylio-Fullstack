package com.example.staylio_backend.service;


import com.example.staylio_backend.dto.response.FeaturedLocationResponse;
import com.example.staylio_backend.dto.response.ProvinceResponse;
import com.example.staylio_backend.dto.response.WardResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.util.List;

public interface ProvinceService {
    void importProvincesFromAPI();
    List<ProvinceResponse> getAllProvinces(String keyword);
    ProvinceResponse getProvinceById(Long id);
    List<WardResponse> getWardsByProvinceId(Long id, String keyword);
    List<FeaturedLocationResponse> getFeaturedLocations();
    PaginationResponse<FeaturedLocationResponse> getFeaturedLocationsPaged(int page, int limit);
}
