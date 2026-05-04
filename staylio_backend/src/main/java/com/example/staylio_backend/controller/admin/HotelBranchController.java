package com.example.staylio_backend.controller.admin;

import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.HotelBranchService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/hotel-branches")
@RequiredArgsConstructor
public class HotelBranchController {
    private final HotelBranchService hotelBranchService;

    @GetMapping
    @Operation(summary = "Danh sách chi nhánh khách sạn")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginationResponse<HotelBranchResponse>>> getHotelBranches(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ){
        ApiResponse<PaginationResponse<HotelBranchResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách chi nhánh khách sạn thành công!",
                hotelBranchService.getHotelBranches(hotelId, search, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 chi nhánh khách sạn")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelBranchResponse>> getHotelBranchById(@PathVariable Long id){
        ApiResponse<HotelBranchResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết chi nhánh khách sạn thành công!",
                hotelBranchService.getHotelBranchById(id),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
