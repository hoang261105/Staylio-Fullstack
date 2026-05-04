package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Hotel;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.HotelRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.CloudinaryService;
import com.example.staylio_backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {
    private final HotelRepo hotelRepo;
    private final ProfileRepo profileRepo;
    private final CloudinaryService cloudinaryService;

    @Override
    public PaginationResponse<HotelResponse> findAll(String search, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<Hotel> hotelsPage = hotelRepo.searchHotels(search, pageable);

        List<HotelResponse> content = hotelsPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                hotelsPage.getNumber() + 1,
                hotelsPage.getSize(),
                hotelsPage.getTotalPages(),
                hotelsPage.getTotalElements()
        );

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public HotelResponse findById(Long id) {
        Hotel hotel = hotelRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy thương hiệu khách sạn!"));
        return convertToDTO(hotel);
    }

    @Override
    public HotelResponse create(HotelRequest request) throws IOException {
        boolean isExistName = hotelRepo.existsByName(request.getName());

        if (isExistName) {
            throw new AppException(ErrorCode.HOTEL_NAME_EXISTED);
        }

        String imageUrl = cloudinaryService.uploadFile(request.getImage());

        Profile profile = profileRepo.findById(request.getManagerId()).orElseThrow(() -> new NoSuchElementException("Không tim thấy quản lí thương hiệu khách sạn!"));

        if (profile.getUser().getRole().getRoleName() != RoleName.ROLE_MANAGER){
            throw new AppException(ErrorCode.IS_NOT_MANAGER);
        }

        boolean isExistManagerId = hotelRepo.existsByManager(profile);

        if (isExistManagerId) {
            throw new AppException(ErrorCode.MANAGER_EXISTED);
        }

        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(true)
                .manager(profile)
                .imageUrl(imageUrl)
                .build();

        Hotel savedHotel = hotelRepo.save(hotel);
        return convertToDTO(savedHotel);
    }

    @Override
    public HotelResponse update(Long id, HotelRequest request) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }

    public HotelResponse convertToDTO(Hotel hotel) {
        return HotelResponse.builder()
                .name(hotel.getName())
                .description(hotel.getDescription())
                .status(hotel.getStatus())
                .imageUrl(hotel.getImageUrl())
                .hostHotelName(hotel.getManager().getFullName())
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
