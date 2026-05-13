package com.example.staylio_backend.service;


import com.example.staylio_backend.dto.response.ProvinceResponse;
import com.example.staylio_backend.dto.response.WardResponse;

import java.util.List;

public interface ProvinceService {
    void importProvincesFromAPI();
    List<ProvinceResponse> getAllProvinces(String keyword);
    ProvinceResponse getProvinceById(Long id);
    List<WardResponse> getWardsByProvinceId(Long id, String keyword);
}
