package com.smartcivic.cms.admin.dto;

import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.common.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminComplaintStatusRequest(
        @NotNull ComplaintStatus status,
        @NotBlank String comment,
        Long departmentId,
        Long officerId,
        Priority priority,
        String solvedImageUrl
) {
}
