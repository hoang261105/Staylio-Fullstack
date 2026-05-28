package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Hotel;
import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.HotelStatus;
import com.example.staylio_backend.model.enums.NotificationType;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.HotelRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.CloudinaryService;
import com.example.staylio_backend.service.HotelService;
import com.example.staylio_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
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
    private final NotificationService notificationService;
    private final HotelBranchRepo branchRepo;

    @Override
    public PaginationResponse<HotelResponse> findAll(String search, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<Hotel> hotelsPage = hotelRepo.searchActiveHotels(search, pageable);

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
    public HotelResponse create(HotelRequest request) {
        return null;
    }

    @Override
    public HotelResponse update(Long id, HotelRequest request) {
        return null;
    }

    @Override
    public void delete(Long id) {
        Hotel hotel = hotelRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Khôn tìm thấy thương hiệu khách sạn!"));
        hotel.setStatus(HotelStatus.DELETED);
        hotelRepo.save(hotel);
    }

    public HotelResponse convertToDTO(Hotel hotel) {
        List<HotelBranch> branches = branchRepo.findAllByHotel_IdAndStatus(hotel.getId(), BranchStatus.CONFIRMED);

        Integer totalBranches = branches.size();

        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .status(hotel.getStatus())
                .imageUrl(hotel.getImageUrl())
                .hostHotelName(hotel.getManager().getFullName())
                .isActive(hotel.isActive())
                .branchCount(totalBranches)
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

    @Override
    public List<HotelResponse> getAllHotels() {
        List<Hotel> hotels = hotelRepo.findAllByStatus(HotelStatus.CONFIRMED);
        return hotels.stream().map(this::convertToDTO).toList();
    }

    @Override
    public void updateStatus(Long id, HotelStatus status) {
        Hotel hotel = hotelRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Khôn tìm thấy thương hiệu khách sạn!"));
        hotel.setStatus(status);
        hotelRepo.save(hotel);
    }



    @Override
    public void updateBulkActive(List<Long> ids, Boolean active) {
        List<Hotel> hotelsToUpdate = hotelRepo.findAllByIdIn(ids);

        if (hotelsToUpdate.isEmpty()){
            throw new NoSuchElementException("Không có thương hiệu khách sạn nào đc chọn!");
        }

        hotelRepo.updateBulkActive(ids, active);
    }

    @Override
    public HotelResponse addHotel(HotelRequest request, UserPrincipal userPrincipal) {
        boolean isExistName = hotelRepo.existsByName(request.getName());

        if (isExistName) {
            throw new AppException(ErrorCode.HOTEL_NAME_EXISTED);
        }

        Profile profile = profileRepo.findById(userPrincipal.getId()).orElseThrow(() -> new NoSuchElementException("Không tim thấy quản lí thương hiệu khách sạn!"));

        boolean isExistManager = hotelRepo.existsByManager_Id(profile.getId());

        if (isExistManager){
            throw new AppException(ErrorCode.MANAGER_EXISTED);
        }

        if (profile.getUser().getRole().getRoleName() != RoleName.ROLE_MANAGER){
            throw new AppException(ErrorCode.IS_NOT_MANAGER);
        }

        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(HotelStatus.PENDING)
                .manager(profile)
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        Hotel savedHotel = hotelRepo.save(hotel);

        notificationService.create(
                NotificationRequest.builder()
                        .senderId(profile.getId())
                        .receiverId(2L)
                        .title("Thương hiệu khách sạn chờ duyệt")
                        .content("Thương hiệu " + savedHotel.getName() + " đang chờ admin duyệt.")
                        .type(NotificationType.HOTEL_BRAND_CREATED)
                        .referenceId(savedHotel.getId())
                        .build()
        );
        try {
            return convertToDTO(savedHotel);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.MANAGER_EXISTED);
        }
    }

    @Override
    public HotelResponse updateHotel(Long id, HotelRequest request, UserPrincipal userPrincipal) {
        boolean isExistName = hotelRepo.existsByNameAndIdNot(request.getName(), id);

        if (isExistName) {
            throw new AppException(ErrorCode.HOTEL_NAME_EXISTED);
        }

        Profile profile = profileRepo.findById(userPrincipal.getId()).orElseThrow(() -> new NoSuchElementException("Không tim thấy quản lí thương hiệu khách sạn!"));

        if (profile.getUser().getRole().getRoleName() != RoleName.ROLE_MANAGER){
            throw new AppException(ErrorCode.IS_NOT_MANAGER);
        }

        Hotel hotel = hotelRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Khôn tìm thấy thương hiệu khách sạn!"));
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setManager(profile);

        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            hotel.setImageUrl(request.getImageUrl());
        } else {
            hotel.setImageUrl(hotel.getImageUrl());
        }

        Hotel updatedHotel = hotelRepo.save(hotel);
        return convertToDTO(updatedHotel);
    }

    @Override
    public HotelResponse getMyHotel(UserPrincipal userPrincipal) {
        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy quản lí!"));

        if (profile.getUser().getRole().getRoleName() != RoleName.ROLE_MANAGER) {
            throw new AppException(ErrorCode.IS_NOT_MANAGER);
        }

        Hotel hotel = hotelRepo.findByManager(profile)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_BRAND_NOT_FOUND));

        return convertToDTO(hotel);
    }
}
