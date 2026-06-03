package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.common.exception.BadRequestException;
import com.example.staylio_backend.common.utils.SecurityUtils;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomRequest;
import com.example.staylio_backend.dto.request.RoomStatusRequest;
import com.example.staylio_backend.dto.request.SearchRoomRequest;
import com.example.staylio_backend.dto.response.RoomImageResponse;
import com.example.staylio_backend.dto.response.RoomResponse;
import com.example.staylio_backend.dto.response.RoomSearchResponse;
import com.example.staylio_backend.dto.response.UtilityResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.ImageStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepo roomRepo;
    private final HotelBranchRepo branchRepo;
    private final ProfileRepo profileRepo;
    private final UtilityRepo utilityRepo;
    private final ReviewRepo reviewRepo;

    @Override
    public PaginationResponse<RoomResponse> getRoomsBySearch(
            String search,
            Long hotelBranchId,
            int page,
            int size,
            RoomStatus status,
            String sortBy,
            String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));
        UserPrincipal principal = SecurityUtils.getCurrentUser();

        Page<Room> roomsPage;

        if (principal != null && principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

            if (hotelBranchId != null) {
                boolean owned = branchRepo.existsByIdAndHotelManagerId(
                        hotelBranchId,
                        profile.getId()
                );

                if (!owned) {
                    throw new AccessDeniedException("Bạn không có quyền xem phòng của chi nhánh này");
                }

                roomsPage = roomRepo.searchRooms(hotelBranchId, search, status, pageable);
            } else {
                roomsPage = roomRepo.findAllRoomsByManager(
                        profile.getId(),
                        search,
                        status,
                        pageable
                );
            }
        } else {
            if (hotelBranchId != null) {
                roomsPage = roomRepo.searchRooms(
                        hotelBranchId,
                        search,
                        status,
                        pageable
                );
            } else {
                roomsPage = roomRepo.findAllRooms(
                        search,
                        status,
                        pageable
                );
            }
        }

        List<RoomResponse> roomResponses = roomsPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                roomsPage.getNumber() + 1,
                roomsPage.getSize(),
                roomsPage.getTotalPages(),
                roomsPage.getTotalElements()
        );

        return new PaginationResponse<>(roomResponses, paginationDTO);
    }

    @Override
    public List<RoomResponse> getAllRooms(Long hotelBranchId) {
        List<Room> rooms = roomRepo.findAllByHotelBranch_Id(hotelBranchId);

        return rooms.stream().map(this::convertToDTO).toList();
    }

    @Override
    public RoomResponse getRoomById(Long id, UserPrincipal userPrincipal) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        HotelBranch branch = room.getHotelBranch();

        Hotel hotel = branch.getHotel();

        if (userPrincipal != null && userPrincipal.hasRole(RoleName.ROLE_MANAGER)){
            if (!hotel.getManager().getId().equals(userPrincipal.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        return convertToDTO(room);
    }

    @Override
    public RoomResponse createRoom(RoomRequest request, UserPrincipal userPrincipal) {
        boolean isExistRoomName = roomRepo.existsByRoomNameAndHotelBranch_Id(request.getRoomName(), request.getHotelBranchId());
        boolean isExistRoomNumber = roomRepo.existsByRoomNumberAndHotelBranch_Id(request.getRoomNumber(), request.getHotelBranchId());

        if (isExistRoomName) {
            throw new AppException(ErrorCode.ROOM_NAME_EXISTED);
        }

        if (isExistRoomNumber) {
            throw new AppException(ErrorCode.ROOM_NUMBER_EXISTED);
        }

        HotelBranch hotelBranch = branchRepo.findById(request.getHotelBranchId()).orElseThrow(() -> new NoSuchElementException(ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        if (!hotelBranch.getHotel().getManager().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        BigDecimal roomPrice = calculateRoomPrice(request);

        Set<Utility> utilities = new HashSet<>(
                utilityRepo.findAllByIdInAndIsDeletedFalse(
                        request.getUtilityIds()
                )
        );

        Room room = Room.builder()
                .roomName(request.getRoomName())
                .roomType(request.getRoomType())
                .description(request.getDescription())
                .hotelBranch(hotelBranch)
                .price(roomPrice)
                .maxAdults(request.getMaxAdults())
                .maxChildren(request.getMaxChildren())
                .capacity(request.getCapacity())
                .adultPrice(request.getAdultPrice())
                .childPrice(request.getChildPrice())
                .bedInfo(request.getBedInfo())
                .area(request.getArea())
                .roomNumber(request.getRoomNumber())
                .floor(request.getFloor())
                .status(RoomStatus.AVAILABLE)
                .isActive(true)
                .isVoucherApplicable(false)
                .utilities(utilities)
                .build();

        List<RoomImage> images = new ArrayList<>();

        for (int i = 0; i < request.getImageUrls().size(); i++) {
            RoomImage image = RoomImage.builder()
                    .room(room)
                    .imageUrl(request.getImageUrls().get(i))
                    .isPrimary(i == 0)
                    .status(ImageStatus.PENDING)
                    .build();

            images.add(image);
        }

        room.setImages(images);

        Room savedRoom = roomRepo.save(room);
        return convertToDTO(savedRoom);
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest request, UserPrincipal userPrincipal) {
        boolean isExistRoomName = roomRepo.existsDuplicateRoomNameForUpdate(request.getRoomName(), request.getHotelBranchId(), id);
        boolean isExistRoomNumber = roomRepo.existsDuplicateRoomNumberForUpdate(request.getRoomNumber(), request.getHotelBranchId(), id);

        if (isExistRoomName) {
            throw new AppException(ErrorCode.ROOM_NAME_EXISTED);
        }

        if (isExistRoomNumber) {
            throw new AppException(ErrorCode.ROOM_NUMBER_EXISTED);
        }

        HotelBranch hotelBranch = branchRepo.findById(request.getHotelBranchId()).orElseThrow(() -> new NoSuchElementException(ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));

        if (hotelBranch.getStatus() != BranchStatus.CONFIRMED){
            throw new AppException(ErrorCode.CANNOT_CREATE_ROOM);
        }

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        if (!hotelBranch.getHotel().getManager().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Set<Utility> utilities = new HashSet<>(
                utilityRepo.findAllByIdInAndIsDeletedFalse(
                        request.getUtilityIds()
                )
        );

        Room room = roomRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));
        BigDecimal roomPrice = calculateRoomPrice(request);
        room.setRoomName(request.getRoomName());
        room.setRoomType(request.getRoomType());
        room.setDescription(request.getDescription());
        room.setHotelBranch(hotelBranch);
        room.setPrice(roomPrice);
        room.setMaxAdults(request.getMaxAdults());
        room.setMaxChildren(request.getMaxChildren());
        room.setCapacity(request.getCapacity());
        room.setAdultPrice(request.getAdultPrice());
        room.setChildPrice(request.getChildPrice());
        room.setBedInfo(request.getBedInfo());
        room.setArea(request.getArea());
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setStatus(RoomStatus.AVAILABLE);
        room.setIsActive(true);
        room.setIsVoucherApplicable(false);
        room.setUtilities(utilities);

        if (request.getImageUrls() != null) {
            room.getImages().clear();

            List<RoomImage> images = new ArrayList<>();

            for (int i = 0; i < request.getImageUrls().size(); i++) {

                RoomImage image = RoomImage.builder()
                        .room(room)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .status(ImageStatus.PENDING)
                        .build();

                images.add(image);
            }

            room.getImages().addAll(images);
        }

        Room updatedRoom = roomRepo.save(room);
        return convertToDTO(updatedRoom);
    }

    @Override
    public void updateStatus(Long id, RoomStatusRequest request, UserPrincipal principal) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Long managerProfileId = room.getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerProfileId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        room.setStatus(request.getStatus());
        roomRepo.save(room);
    }

    @Override
    public void updateActive(Long id, UserPrincipal userPrincipal) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Long managerProfileId = room.getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerProfileId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        room.setIsActive(!room.getIsActive());
        roomRepo.save(room);
    }

    @Override
    public void updateVoucher(Long id, UserPrincipal userPrincipal) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        Long managerProfileId = room.getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerProfileId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        room.setIsVoucherApplicable(!room.getIsVoucherApplicable());
        roomRepo.save(room);
    }

    @Override
    public PaginationResponse<RoomSearchResponse> searchRooms(SearchRoomRequest request) {
        int pageIndex = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(
                pageIndex,
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection())
        );

        Page<Room> roomsPage = roomRepo.searchAvailableRooms(
                request.getKeyword(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getStatus(),
                request.getAdults(),
                request.getChildren(),
                request.getCapacity(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRating(),
                pageable
        );

        List<RoomSearchResponse> rooms = roomsPage.getContent().stream()
                .map(this::convertToSearchResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                roomsPage.getNumber() + 1,
                roomsPage.getSize(),
                roomsPage.getTotalPages(),
                roomsPage.getTotalElements()
        );

        return new PaginationResponse<>(rooms, paginationDTO);
    }

    public RoomResponse convertToDTO(Room room) {
        Set<UtilityResponse> utilities = room.getUtilities()
                .stream()
                .filter(u -> !Boolean.TRUE.equals(u.getIsDeleted()))
                .map(u -> new UtilityResponse(
                        u.getId(),
                        u.getTitle(),
                        u.getIconName(),
                        u.getDescription(),
                        u.getIsDeleted()
                ))
                .collect(Collectors.toSet());

        Set<RoomImageResponse> roomImages = room.getImages().stream()
                .map(rm -> new RoomImageResponse(
                        rm.getId(),
                        rm.getRoom().getRoomName(),
                        rm.getImageUrl(),
                        rm.getIsPrimary(),
                        rm.getStatus()
                ))
                .collect(Collectors.toSet());

        Long countReview = roomRepo.countReviewsByRoomId(room.getId());
        Double averageRating = roomRepo.averageRatingByRoomId(room.getId());

        return new RoomResponse(
                room.getId(),
                room.getHotelBranch().getId(),
                room.getRoomName(),
                room.getRoomType(),
                room.getDescription(),
                room.getHotelBranch().getBranchName(),
                room.getPrice(),
                room.getMaxAdults(),
                room.getMaxChildren(),
                room.getCapacity(),
                room.getAdultPrice(),
                room.getChildPrice(),
                room.getBedInfo(),
                room.getArea(),
                room.getRoomNumber(),
                room.getFloor(),
                room.getStatus(),
                room.getIsActive(),
                room.getIsVoucherApplicable(),
                utilities,
                roomImages,
                countReview,
                roundRating(averageRating),
                room.getHotelBranch().getHotel().getPolicy()
        );
    }

    private RoomSearchResponse convertToSearchResponse(Room room) {

        Long reviewCount =
                reviewRepo.countReviewsByBranchId(room.getId());

        Double averageRating =
                reviewRepo.averageRatingByBranchId(room.getId());

        return RoomSearchResponse.builder()
                .roomId(room.getId())
                .roomName(room.getRoomName())
                .roomType(room.getRoomType())

                .images(
                        room.getImages()
                                .stream()
                                .map(RoomImage::getImageUrl)
                                .toList()
                )

                .hotelId(room.getHotelBranch().getHotel().getId())
                .hotelName(room.getHotelBranch().getHotel().getName())

                .hotelBranchId(room.getHotelBranch().getId())
                .hotelBranchName(room.getHotelBranch().getBranchName())

                .address(
                        room.getHotelBranch().getAddress()
                )

                .provinceName(
                        room.getHotelBranch()
                                .getWard()
                                .getProvince()
                                .getProvince()
                )

                .capacity(room.getCapacity())
                .maxAdults(room.getMaxAdults())
                .maxChildren(room.getMaxChildren())

                .price(room.getPrice())

                .averageRating(
                        roundRating(averageRating)
                )
                .reviewCount(reviewCount)
                .status(room.getStatus())
                .build();
    }

    private Sort getSort(String sortBy, String direction) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String safeSortBy = sortBy == null || sortBy.isBlank()
                ? "id"
                : sortBy;

        String property = switch (safeSortBy) {
            case "hotelBranchName" -> "hotelBranch.hotelBranchName";
            case "roomName" -> "roomName";
            case "roomNumber" -> "roomNumber";
            case "price" -> "price";
            default -> "id";
        };

        return Sort.by(dir, property);
    }

    private BigDecimal calculateRoomPrice(RoomRequest request) {
        return request.getAdultPrice()
                .multiply(BigDecimal.valueOf(request.getMaxAdults()))
                .add(
                        request.getChildPrice()
                                .multiply(BigDecimal.valueOf(request.getMaxChildren()))
                );
    }

    private Double roundRating(Double rating) {
        if (rating == null) {
            return 0.0;
        }

        return Math.round(rating * 10.0) / 10.0;
    }

}
