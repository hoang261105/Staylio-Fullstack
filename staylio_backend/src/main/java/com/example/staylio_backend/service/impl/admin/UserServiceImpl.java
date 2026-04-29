package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.dto.response.UserResponseDTO;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AccountRepo accountRepo;

    @Override
    public PaginationResponse<UserResponseDTO> getStudentList(String search, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        List<RoleName> targetRoles = List.of(RoleName.ROLE_MANAGER, RoleName.ROLE_CUSTOMER);

        // Gọi hàm tìm kiếm có lọc Role
        Page<User> userPage = accountRepo.findByRole_RoleNameIn(targetRoles, pageable);

        List<UserResponseDTO> content = userPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                userPage.getNumber() + 1,
                userPage.getSize(),
                userPage.getTotalPages(),
                userPage.getTotalElements()
        );
        return new PaginationResponse<>(content, paginationDTO);
    }

    private UserResponseDTO convertToDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getProfile().getFullName())
                .avatarUrl(user.getProfile().getAvatarUrl())
                .phone(user.getProfile().getPhone())
                .roleName(user.getRole().getRoleName())
                .status(user.getStatus())
                .build();
    }

    private Sort getSort(String sortBy, String direction) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by("id").descending();
        }

        String property = sortBy.equals("fullName") ? "profile.fullName" : sortBy;

        return direction.equalsIgnoreCase("desc") ?
                Sort.by(property).descending() : Sort.by(property).ascending();
    }
}
