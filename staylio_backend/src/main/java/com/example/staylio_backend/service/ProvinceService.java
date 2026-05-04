package com.example.staylio_backend.service;


import com.example.staylio_backend.dto.response.ProvinceResponse;

import java.util.List;

public interface ProvinceService {
    void importProvincesFromAPI();
    List<ProvinceResponse> getAllProvinces();
    ProvinceResponse getProvinceById(Long id);
}
