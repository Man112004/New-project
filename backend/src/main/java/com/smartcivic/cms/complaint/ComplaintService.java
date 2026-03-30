package com.smartcivic.cms.complaint;

import com.smartcivic.cms.common.ComplaintCategory;
import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.common.Priority;
import com.smartcivic.cms.common.exception.BadRequestException;
import com.smartcivic.cms.common.exception.ResourceNotFoundException;
import com.smartcivic.cms.common.Role;
import com.smartcivic.cms.complaint.dto.ComplaintRequest;
import com.smartcivic.cms.complaint.dto.ComplaintResponse;
import com.smartcivic.cms.complaint.dto.ComplaintUpdateRequest;
import com.smartcivic.cms.complaint.dto.RatingRequest;
import com.smartcivic.cms.department.Department;
import com.smartcivic.cms.department.DepartmentRepository;
import com.smartcivic.cms.notification.NotificationService;
import com.smartcivic.cms.user.User;
import com.smartcivic.cms.user.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;
    private final ComplaintMapper complaintMapper;

    public ComplaintResponse createComplaint(Long userId, ComplaintRequest request) {
        User user = findUser(userId);
        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setCategory(request.category());
        complaint.setTitle(request.title());
        complaint.setDescription(request.description());
        complaint.setImageUrl(request.imageUrl());
        complaint.setVideoUrl(request.videoUrl());
        complaint.setLatitude(request.latitude());
        complaint.setLongitude(request.longitude());
        complaint.setAddress(request.address());
        complaint.setCity(request.city() == null || request.city().isBlank() ? user.getCity() : request.city());
        complaint.setWard(request.ward());
        complaint.setArea(request.area());
        complaint.setPriority(derivePriority(request.category()));
        complaintRepository.save(complaint);
        addUpdate(complaint, user, ComplaintStatus.PENDING, "Complaint created by citizen");
        notificationService.notify(user, "Complaint #" + complaint.getId() + " has been registered.");
        return getComplaint(complaint.getId(), userId, false);
    }

    public List<ComplaintResponse> getComplaintsForUser(Long userId) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ComplaintResponse getComplaint(Long complaintId, Long requesterId, boolean adminAccess) {
        Complaint complaint = findComplaint(complaintId);
        if (!adminAccess && !complaint.getUser().getId().equals(requesterId)) {
            throw new BadRequestException("Access denied for this complaint");
        }
        return toResponse(complaint);
    }

    public ComplaintResponse reopenComplaint(Long complaintId, Long userId) {
        Complaint complaint = validateCitizenAccess(complaintId, userId);
        if (complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Only resolved complaints can be reopened");
        }
        complaint.setStatus(ComplaintStatus.REOPENED);
        complaint.setReopenCount(complaint.getReopenCount() + 1);
        complaint.setUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);
        addUpdate(complaint, complaint.getUser(), ComplaintStatus.REOPENED, "Complaint reopened by citizen");
        notificationService.notify(complaint.getUser(), "Complaint #" + complaint.getId() + " has been reopened.");
        return toResponse(complaint);
    }

    public ComplaintResponse rateComplaint(Long complaintId, Long userId, RatingRequest request) {
        Complaint complaint = validateCitizenAccess(complaintId, userId);
        if (complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Only resolved complaints can be rated");
        }
        complaint.setServiceRating(request.rating());
        complaint.setUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);
        return toResponse(complaint);
    }

    public ComplaintResponse adminUpdateComplaint(Long complaintId, Long adminId, ComplaintUpdateRequest request) {
        Complaint complaint = findComplaint(complaintId);
        User admin = findUser(adminId);
        complaint.setStatus(request.status());
        complaint.setPriority(request.priority() != null ? request.priority() : complaint.getPriority());
        complaint.setSolvedImageUrl(request.solvedImageUrl());
        complaint.setUpdatedAt(LocalDateTime.now());
        if (request.departmentId() != null) {
            Department department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            complaint.setAssignedDepartment(department);
        }
        complaintRepository.save(complaint);
        addUpdate(complaint, admin, request.status(), request.comment());
        notificationService.notify(complaint.getUser(),
                "Complaint #" + complaint.getId() + " status updated to " + request.status().name().replace('_', ' ') + ".");
        return toResponse(complaint);
    }

    public ComplaintResponse adminUpdateComplaintStatus(Long complaintId,
                                                        Long adminId,
                                                        ComplaintStatus status,
                                                        String comment,
                                                        Long departmentId,
                                                        Long officerId,
                                                        Priority priority,
                                                        String solvedImageUrl) {
        Complaint complaint = findComplaint(complaintId);
        User admin = findUser(adminId);

        complaint.setStatus(status);
        complaint.setPriority(priority != null ? priority : complaint.getPriority());
        complaint.setSolvedImageUrl(solvedImageUrl);
        complaint.setUpdatedAt(LocalDateTime.now());

        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            complaint.setAssignedDepartment(department);
        }

        if (officerId != null) {
            User officer = findUser(officerId);
            if (officer.getRole() != Role.OFFICER) {
                throw new BadRequestException("Selected user is not an officer");
            }
            complaint.setAssignedOfficer(officer);
        }

        complaintRepository.save(complaint);
        addUpdate(complaint, admin, status, comment);
        notificationService.notify(complaint.getUser(),
                "Complaint #" + complaint.getId() + " status updated to " + status.name().replace('_', ' ') + ".");
        return toResponse(complaint);
    }

    public void deleteComplaint(Long complaintId) {
        Complaint complaint = findComplaint(complaintId);
        complaintUpdateRepository.deleteAll(complaintUpdateRepository.findByComplaintIdOrderByUpdatedAtDesc(complaintId));
        complaintRepository.delete(complaint);
    }

    public List<ComplaintResponse> filterComplaints(Map<String, String> filters) {
        Specification<Complaint> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filters.containsKey("city")) {
                predicates.add(cb.equal(cb.lower(root.get("city")), filters.get("city").toLowerCase()));
            }
            if (filters.containsKey("ward")) {
                predicates.add(cb.equal(cb.lower(root.get("ward")), filters.get("ward").toLowerCase()));
            }
            if (filters.containsKey("area")) {
                predicates.add(cb.equal(cb.lower(root.get("area")), filters.get("area").toLowerCase()));
            }
            if (filters.containsKey("category")) {
                predicates.add(cb.equal(root.get("category"), ComplaintCategory.valueOf(filters.get("category"))));
            }
            if (filters.containsKey("status")) {
                predicates.add(cb.equal(root.get("status"), ComplaintStatus.valueOf(filters.get("status"))));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return complaintRepository.findAll(specification).stream().map(this::toResponse).toList();
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        return complaintMapper.toResponse(
                complaint,
                complaintUpdateRepository.findByComplaintIdOrderByUpdatedAtDesc(complaint.getId())
        );
    }

    private Complaint validateCitizenAccess(Long complaintId, Long userId) {
        Complaint complaint = findComplaint(complaintId);
        if (!complaint.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied for this complaint");
        }
        return complaint;
    }

    private Complaint findComplaint(Long complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void addUpdate(Complaint complaint, User updatedBy, ComplaintStatus status, String comment) {
        ComplaintUpdate update = new ComplaintUpdate();
        update.setComplaint(complaint);
        update.setUpdatedBy(updatedBy);
        update.setStatus(status);
        update.setComment(comment);
        complaintUpdateRepository.save(update);
    }

    private Priority derivePriority(ComplaintCategory category) {
        return switch (category) {
            case ROAD_DAMAGE, TRAFFIC_SIGNAL, TREE_FALLEN -> Priority.HIGH;
            case WATER_LEAKAGE, DRAINAGE -> Priority.MEDIUM;
            default -> Priority.LOW;
        };
    }
}
