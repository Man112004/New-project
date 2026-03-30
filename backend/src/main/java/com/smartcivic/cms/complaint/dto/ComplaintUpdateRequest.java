package com.smartcivic.cms.complaint.dto;

import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.common.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComplaintUpdateRequest(
        @NotNull ComplaintStatus status,
        @NotBlank String comment,
        Long departmentId,
        Priority priority,
        String solvedImageUrl
) {
}
