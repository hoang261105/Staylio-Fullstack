package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.common.exception.BadRequestException;
import com.example.staylio_backend.common.utils.SecurityUtils;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomRequest;
import com.example.staylio_backend.dto.request.RoomStatusRequest;
import com.example.staylio_backend.dto.response.RoomResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Hotel;
import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.HotelRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.repository.RoomRepo;
import com.example.staylio_backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepo roomRepo;
    private final HotelBranchRepo branchRepo;
    private final ProfileRepo profileRepo;

    @Override
    public PaginationResponse<RoomResponse> getAllRooms(String search, Long hotelBranchId, int page, int size, RoomStatus status, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        UserPrincipal principal = SecurityUtils.getCurrentUser();

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            if (hotelBranchId == null) {
                throw new BadRequestException("Vui lòng chọn chi nhánh");
            }

            boolean owned = branchRepo.existsByIdAndHotelManagerId(
                    hotelBranchId,
                    principal.getId()
            );

            if (!owned) {
                throw new AccessDeniedException("Bạn không có quyền xem phòng của chi nhánh này");
            }
        }

        Page<Room> roomsPage = roomRepo.searchRooms(
                hotelBranchId,
                search,
                status,
                pageable
        );

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
    public RoomResponse getRoomById(Long id, UserPrincipal userPrincipal) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        HotelBranch branch = room.getHotelBranch();

        Hotel hotel = branch.getHotel();

        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        boolean isManager = userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"));

        if (!isAdmin) {
            if (!isManager || !hotel.getManager().getId().equals(userPrincipal.getId())) {
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
                .build();

        Room savedRoom = roomRepo.save(room);
        return convertToDTO(savedRoom);
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest request, UserPrincipal userPrincipal) {
        boolean isExistRoomName = roomRepo.existsByRoomNameAndHotelBranch_IdAndIdNot(request.getRoomName(), request.getHotelBranchId(), id);
        boolean isExistRoomNumber = roomRepo.existsByRoomNumberAndHotelBranch_IdAndIdNot(request.getRoomNumber(), request.getHotelBranchId(), id);

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
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

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

    public RoomResponse convertToDTO(Room room) {
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
                room.getIsVoucherApplicable()
        );
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
}
