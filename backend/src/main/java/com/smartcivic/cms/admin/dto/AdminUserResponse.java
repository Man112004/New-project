package com.smartcivic.cms.admin.dto;

import com.smartcivic.cms.common.Role;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Role role,
        String city,
        String departmentName,
        boolean enabled,
        LocalDateTime createdAt
) {
}
