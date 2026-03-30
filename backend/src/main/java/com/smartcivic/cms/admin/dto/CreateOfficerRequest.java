package com.smartcivic.cms.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOfficerRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian mobile number") String phone,
        @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @NotBlank String city,
        Long departmentId
) {
}
