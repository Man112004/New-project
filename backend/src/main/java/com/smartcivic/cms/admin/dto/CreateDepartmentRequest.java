package com.smartcivic.cms.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateDepartmentRequest(
        @NotBlank String name,
        @NotBlank String city
) {
}
