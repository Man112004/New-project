package com.smartcivic.cms.complaint;

import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "complaint_updates")
public class ComplaintUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "complaint_id")
    private Complaint complaint;
    @Column(nullable = false, length = 1000)
    private String comment;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "updated_by")
    private User updatedBy;
    private LocalDateTime updatedAt = LocalDateTime.now();
}
