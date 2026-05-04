package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.entity.Ward;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.WardRepo;
import com.example.staylio_backend.service.HotelBranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class HotelBranchServiceImpl implements HotelBranchService {
    private final HotelBranchRepo branchRepo;
    private final WardRepo wardRepo;

    @Override
    public PaginationResponse<HotelBranchResponse> getHotelBranches(Long hotelId, String search, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<HotelBranch> branchPage = branchRepo.searchBranches(hotelId, search, pageable);

        List<HotelBranchResponse> content = branchPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                branchPage.getNumber() + 1,
                branchPage.getSize(),
                branchPage.getTotalPages(),
                branchPage.getTotalElements()
        );
        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public HotelBranchResponse getHotelBranchById(Long id) {
        HotelBranch hotelBranch = branchRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy chi nhánh khách sạn!"));
        return convertToDTO(hotelBranch);
    }

    public HotelBranchResponse convertToDTO(HotelBranch hotelBranch) {
        Ward ward = wardRepo.findById(hotelBranch.getWard().getId()).orElseThrow(() -> new RuntimeException("Ward not found"));

        return HotelBranchResponse.builder()
                .hotelBranchName(hotelBranch.getBranchName())
                .hotelName(hotelBranch.getHotel().getName())
                .imageUrl(hotelBranch.getImageUrl())
                .address(hotelBranch.getAddress())
                .provinceName(ward.getProvince().getProvince())
                .wardName(hotelBranch.getWard().getName())
                .status(hotelBranch.getStatus())
                .build();
    }

    private Sort getSort(String sortBy, String direction) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by("id").descending();
        }

        String property = sortBy.equals("fullName") ? "manager.fullName" : sortBy;

        return direction.equalsIgnoreCase("desc") ?
                Sort.by(property).descending() : Sort.by(property).ascending();
    }

}
