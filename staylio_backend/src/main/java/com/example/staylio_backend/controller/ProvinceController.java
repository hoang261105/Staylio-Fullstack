package com.example.staylio_backend.controller;

import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ProvinceResponse;
import com.example.staylio_backend.service.ProvinceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/provinces")
@RequiredArgsConstructor
public class ProvinceController {
    private final ProvinceService provinceService;

    @GetMapping("/import")
    public String importProvinces() {
        provinceService.importProvincesFromAPI();
        return "Import provinces successfully!";
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProvinceResponse>> getProvinceById(@PathVariable Long id){
        ApiResponse<ProvinceResponse> apiResponse = new ApiResponse<>(
                true,
                "Lấy chi tiết thành công!",
                provinceService.getProvinceById(id),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> getAllProvinces() {
        ApiResponse<List<ProvinceResponse>> apiResponse = new ApiResponse<>(
                true,
                "Lấy danh sách tỉnh thành thành công!",
                provinceService.getAllProvinces(),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
