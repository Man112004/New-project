package com.smartcivic.cms.complaint;

import com.smartcivic.cms.common.ComplaintCategory;
import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.common.Priority;
import com.smartcivic.cms.department.Department;
import com.smartcivic.cms.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintCategory category;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, length = 2000)
    private String description;
    private String imageUrl;
    private String videoUrl;
    @Column(nullable = false)
    private Double latitude;
    @Column(nullable = false)
    private Double longitude;
    @Column(nullable = false)
    private String address;
    private String city;
    private String ward;
    private String area;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status = ComplaintStatus.PENDING;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department assignedDepartment;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;
    private String solvedImageUrl;
    private Integer reopenCount = 0;
    private Integer serviceRating;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
