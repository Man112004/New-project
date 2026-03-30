package com.smartcivic.cms.complaint.dto;

import com.smartcivic.cms.common.ComplaintStatus;

import java.time.LocalDateTime;

public record ComplaintTimelineItem(
        Long id,
        String comment,
        ComplaintStatus status,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
