package com.smartcivic.cms.report;

import java.util.Map;

public record ReportsResponse(
        DashboardSummary dashboard,
        Map<String, Long> departmentBreakdown,
        Map<String, Long> categoryBreakdown
) {
}
