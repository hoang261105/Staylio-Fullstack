package com.example.staylio_backend.controller.admin;

import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.request.ProfileRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {
    private final HotelService hotelService;

    @GetMapping
    @Operation(summary = "Danh sách thương hiệu khách sạn")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginationResponse<HotelResponse>>> getAllHotels(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<HotelResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách thương hiệu thành công!",
                hotelService.findAll(search, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 thương hiệu khách sạn")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(
            @PathVariable Long id
    ) {
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết thương hiệu khách sạn thành công!",
                hotelService.findById(id),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Thêm mới 1 thương hiệu khách sạn",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = HotelRequest.class)
            )
    ))
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
            @Valid @ModelAttribute HotelRequest hotelRequest
    ) throws IOException {
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Thêm 1 thương hiêu khách sạn thành công!",
                hotelService.create(hotelRequest),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
