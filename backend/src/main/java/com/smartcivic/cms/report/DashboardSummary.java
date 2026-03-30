package com.smartcivic.cms.report;

import com.smartcivic.cms.complaint.dto.ComplaintResponse;

import java.util.List;
import java.util.Map;

public record DashboardSummary(
        long totalComplaints,
        long pendingComplaints,
        long inProgressComplaints,
        long resolvedComplaints,
        Map<String, Long> byCategory,
        Map<String, Long> byDepartment,
        Map<String, Long> byCity,
        Map<String, Long> byWard,
        List<ComplaintResponse> recentComplaints
) {
}
