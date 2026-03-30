package com.smartcivic.cms.auth.dto;

import com.smartcivic.cms.common.Role;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        Role role,
        String city
) {
}
