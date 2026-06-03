package com.example.staylio_backend.controller;

import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.FeaturedLocationResponse;
import com.example.staylio_backend.dto.response.ProvinceResponse;
import com.example.staylio_backend.dto.response.WardResponse;
import com.example.staylio_backend.service.ProvinceService;
import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> getAllProvinces(
            @RequestParam(required = false) String keyword
    ) {
        ApiResponse<List<ProvinceResponse>> apiResponse = new ApiResponse<>(
                true,
                "Lấy danh sách tỉnh thành thành công!",
                provinceService.getAllProvinces(keyword),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}/wards")
    @Operation(summary = "Danh sách xã/phường của tỉnh thánh")
    public ResponseEntity<ApiResponse<List<WardResponse>>> getWardsByProvinceId(
            @PathVariable Long id,
            @RequestParam(required = false) String keyword
    ){
        ApiResponse<List<WardResponse>> apiResponse = new ApiResponse<>(
                true,
                "Lấy danh sách xã/phường thành công!",
                provinceService.getWardsByProvinceId(id, keyword),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/featured")
    @Operation(summary = "Lấy danh sách các tỉnh thành nổi bật")
    public ResponseEntity<ApiResponse<List<FeaturedLocationResponse>>> getFeaturedLocations() {
        ApiResponse<List<FeaturedLocationResponse>> apiResponse = new ApiResponse<>(
                true,
                "Lấy danh sách địa điểm nổi bật thành công!",
                provinceService.getFeaturedLocations(),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
