package com.smartcivic.cms.complaint.dto;

import com.smartcivic.cms.common.ComplaintCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComplaintRequest(
        @NotNull ComplaintCategory category,
        @NotBlank String title,
        @NotBlank String description,
        String imageUrl,
        String videoUrl,
        @NotNull Double latitude,
        @NotNull Double longitude,
        @NotBlank String address,
        String city,
        String ward,
        String area
) {
}
