package com.smartcivic.cms.complaint.dto;

import com.smartcivic.cms.common.ComplaintCategory;
import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.common.Priority;

import java.time.LocalDateTime;
import java.util.List;

public record ComplaintResponse(
        Long id,
        String citizenName,
        String citizenEmail,
        ComplaintCategory category,
        String title,
        String description,
        String imageUrl,
        String videoUrl,
        Double latitude,
        Double longitude,
        String address,
        String city,
        String ward,
        String area,
        ComplaintStatus status,
        Priority priority,
        Long departmentId,
        String departmentName,
        Long assignedOfficerId,
        String assignedOfficerName,
        String solvedImageUrl,
        Integer reopenCount,
        Integer serviceRating,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ComplaintTimelineItem> updates
) {
}
