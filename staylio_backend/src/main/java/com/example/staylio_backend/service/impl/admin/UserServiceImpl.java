package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.UserResponseDTO;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.exception.AppException;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Role;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.ErrorCode;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.repository.RoleRepo;
import com.example.staylio_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AccountRepo accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepo roleRepo;

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

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = accountRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy user!"));
        return convertToDTO(user);
    }

    @Override
    public UserResponseDTO createUser(UserRegisterRequest userRegisterRequest) {
        boolean isExistUserName = accountRepo.existsByUserName(userRegisterRequest.getUserName());
        boolean isExistEmail = accountRepo.existsByEmail(userRegisterRequest.getEmail());

        if (isExistUserName) {
            throw new AppException(ErrorCode.USER_EXISTED, "userName");
        }
        if (isExistEmail) {
            throw new AppException(ErrorCode.EMAIL_EXISTED, "email");
        }

        Role defaultRole = roleRepo.findByRoleName(RoleName.ROLE_CUSTOMER);

        Profile profile = Profile.builder()
                .fullName(userRegisterRequest.getFullName())
                .gender(userRegisterRequest.getGender())
                .avatarUrl("https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg")
                .dateOfBirth(userRegisterRequest.getDateOfBirth())
                .build();

        User user = User.builder()
                .userName(userRegisterRequest.getUserName())
                .email(userRegisterRequest.getEmail())
                .passwordHash(passwordEncoder.encode(userRegisterRequest.getPassword()))
                .role(defaultRole)
                .profile(profile)
                .status(UserStatus.ACTIVE)
                .isFirstLogin(false)
                .isEmailVerified(true)
                .build();

        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = accountRepo.save(user);
        return convertToDTO(savedUser);
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
