package com.smartcivic.cms.complaint;

import com.smartcivic.cms.common.ComplaintCategory;
import com.smartcivic.cms.common.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long>, JpaSpecificationExecutor<Complaint> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByStatus(ComplaintStatus status);
    long countByCategory(ComplaintCategory category);
}
