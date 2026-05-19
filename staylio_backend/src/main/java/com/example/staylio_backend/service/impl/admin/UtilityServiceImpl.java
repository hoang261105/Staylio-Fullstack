package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.dto.request.UtilityRequest;
import com.example.staylio_backend.dto.response.UtilityResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Utility;
import com.example.staylio_backend.repository.UtilityRepo;
import com.example.staylio_backend.service.UtilityService;
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
public class UtilityServiceImpl implements UtilityService {
    private final UtilityRepo utilityRepo;

    @Override
    public PaginationResponse<UtilityResponse> findAll(String title, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<Utility> utilitiesPage;

        if (title == null || title.isBlank()) {
            utilitiesPage = utilityRepo.findAll(pageable);
        } else {
            utilitiesPage = utilityRepo.findAllByTitleContainingIgnoreCase(title, pageable);
        }

        List<UtilityResponse> content = utilitiesPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                utilitiesPage.getNumber() + 1,
                utilitiesPage.getSize(),
                utilitiesPage.getTotalPages(),
                utilitiesPage.getTotalElements()
        );

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public UtilityResponse findById(Long id) {
        Utility utility = utilityRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.UTILITY_NOT_FOUND.getMessage()));
        return convertToResponse(utility);
    }

    @Override
    public UtilityResponse create(UtilityRequest request) {
        boolean isExistTitle = utilityRepo.existsByTitleIgnoreCase(request.getTitle());

        if (isExistTitle) {
            throw new AppException(ErrorCode.UTILITY_TITLE_EXISTED);
        }

        Utility utility = Utility.builder()
                .title(request.getTitle())
                .iconName(request.getIconName())
                .description(request.getDescription())
                .isDeleted(false)
                .build();

        Utility savedUtility = utilityRepo.save(utility);
        return convertToResponse(savedUtility);
    }

    @Override
    public UtilityResponse update(Long id, UtilityRequest request) {
        boolean isExistTitle = utilityRepo.existsByTitleIgnoreCaseAndIdNot(request.getTitle(), id);
        if (isExistTitle) {
            throw new AppException(ErrorCode.UTILITY_TITLE_EXISTED);
        }

        Utility utility = utilityRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.UTILITY_NOT_FOUND.getMessage()));
        utility.setTitle(request.getTitle());
        utility.setIconName(request.getIconName());
        utility.setDescription(request.getDescription());

        Utility updatedUtility = utilityRepo.save(utility);
        return convertToResponse(updatedUtility);
    }

    @Override
    public void delete(Long aLong) {

    }

    public UtilityResponse convertToResponse(Utility utility) {
        return new UtilityResponse(
                utility.getId(),
                utility.getTitle(),
                utility.getIconName(),
                utility.getDescription(),
                utility.getIsDeleted()
        );
    }

    private Sort getSort(String sortBy, String direction) {
        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "title";
        }

        Sort.Direction sortDirection =
                "desc".equalsIgnoreCase(direction)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        return Sort.by(sortDirection, sortBy);
    }

    @Override
    public List<UtilityResponse> getAllUtilities() {
        return utilityRepo.findAllByIsDeletedFalse().stream().map(this::convertToResponse).toList();
    }

    @Override
    public void updateActive(Long id) {
        Utility utility = utilityRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.UTILITY_NOT_FOUND.getMessage()));

        utility.setIsDeleted(!utility.getIsDeleted());
        utilityRepo.save(utility);
    }
}
