package com.smartcivic.cms.complaint;

import com.smartcivic.cms.complaint.dto.ComplaintResponse;
import com.smartcivic.cms.complaint.dto.ComplaintTimelineItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComplaintMapper {

    public ComplaintResponse toResponse(Complaint complaint, List<ComplaintUpdate> updates) {
        return new ComplaintResponse(
                complaint.getId(),
                complaint.getUser().getName(),
                complaint.getUser().getEmail(),
                complaint.getCategory(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getImageUrl(),
                complaint.getVideoUrl(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getAddress(),
                complaint.getCity(),
                complaint.getWard(),
                complaint.getArea(),
                complaint.getStatus(),
                complaint.getPriority(),
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getId() : null,
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : null,
                complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getId() : null,
                complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getName() : null,
                complaint.getSolvedImageUrl(),
                complaint.getReopenCount(),
                complaint.getServiceRating(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                updates.stream().map(this::toTimeline).toList()
        );
    }

    private ComplaintTimelineItem toTimeline(ComplaintUpdate update) {
        return new ComplaintTimelineItem(
                update.getId(),
                update.getComment(),
                update.getStatus(),
                update.getUpdatedBy().getName(),
                update.getUpdatedAt()
        );
    }
}
