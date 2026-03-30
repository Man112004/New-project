package com.smartcivic.cms.admin;

import com.smartcivic.cms.admin.dto.AdminUserResponse;
import com.smartcivic.cms.admin.dto.CreateDepartmentRequest;
import com.smartcivic.cms.admin.dto.CreateOfficerRequest;
import com.smartcivic.cms.common.Role;
import com.smartcivic.cms.common.exception.BadRequestException;
import com.smartcivic.cms.common.exception.ResourceNotFoundException;
import com.smartcivic.cms.department.Department;
import com.smartcivic.cms.department.DepartmentRepository;
import com.smartcivic.cms.user.User;
import com.smartcivic.cms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminManagementService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Department createDepartment(CreateDepartmentRequest request) {
        Department department = new Department();
        department.setName(request.name());
        department.setCity(request.city());
        return departmentRepository.save(department);
    }

    public AdminUserResponse createOfficer(CreateOfficerRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByPhone(request.phone())) {
            throw new BadRequestException("Phone is already registered");
        }

        Department department = null;
        if (request.departmentId() != null) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }

        User officer = new User();
        officer.setName(request.name());
        officer.setEmail(request.email().toLowerCase());
        officer.setPhone(request.phone());
        officer.setPassword(passwordEncoder.encode(request.password()));
        officer.setRole(Role.OFFICER);
        officer.setCity(request.city());
        officer.setDepartment(department);
        return toUserResponse(userRepository.save(officer));
    }

    public List<AdminUserResponse> getUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    public List<AdminUserResponse> getOfficers(String city) {
        List<User> officers = (city == null || city.isBlank())
                ? userRepository.findByRole(Role.OFFICER)
                : userRepository.findByRoleAndCityIgnoreCase(Role.OFFICER, city);
        return officers.stream().map(this::toUserResponse).toList();
    }

    private AdminUserResponse toUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCity(),
                user.getDepartment() != null ? user.getDepartment().getName() : null,
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
