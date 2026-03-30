package com.smartcivic.cms.report;

import com.smartcivic.cms.admin.AdminManagementService;
import com.smartcivic.cms.admin.dto.AdminComplaintStatusRequest;
import com.smartcivic.cms.admin.dto.AdminUserResponse;
import com.smartcivic.cms.admin.dto.CreateDepartmentRequest;
import com.smartcivic.cms.admin.dto.CreateOfficerRequest;
import com.smartcivic.cms.complaint.ComplaintService;
import com.smartcivic.cms.complaint.dto.ComplaintResponse;
import com.smartcivic.cms.complaint.dto.ComplaintUpdateRequest;
import com.smartcivic.cms.department.Department;
import com.smartcivic.cms.user.User;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
public class AdminController {

    private final ComplaintService complaintService;
    private final ReportService reportService;
    private final AdminManagementService adminManagementService;

    @GetMapping("/dashboard")
    public DashboardSummary dashboard() {
        return reportService.getSummary();
    }

    @GetMapping("/reports")
    public ReportsResponse reports() {
        return reportService.getReports();
    }

    @GetMapping("/complaints")
    public List<ComplaintResponse> complaints(@RequestParam Map<String, String> filters) {
        return complaintService.filterComplaints(filters);
    }

    @GetMapping("/complaints/{id}")
    public ComplaintResponse complaint(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return complaintService.getComplaint(id, user.getId(), true);
    }

    @PutMapping("/complaints/{id}")
    public ComplaintResponse updateComplaint(@PathVariable Long id,
                                             @AuthenticationPrincipal User user,
                                             @Valid @RequestBody ComplaintUpdateRequest request) {
        return complaintService.adminUpdateComplaint(id, user.getId(), request);
    }

    @PutMapping("/complaints/{id}/status")
    public ComplaintResponse updateComplaintStatus(@PathVariable Long id,
                                                   @AuthenticationPrincipal User user,
                                                   @Valid @RequestBody AdminComplaintStatusRequest request) {
        return complaintService.adminUpdateComplaintStatus(
                id,
                user.getId(),
                request.status(),
                request.comment(),
                request.departmentId(),
                request.officerId(),
                request.priority(),
                request.solvedImageUrl()
        );
    }

    @DeleteMapping("/complaints/{id}")
    public Map<String, String> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return Map.of("message", "Complaint deleted successfully");
    }

    @PostMapping("/departments")
    public Department createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        return adminManagementService.createDepartment(request);
    }

    @PostMapping("/officers")
    public AdminUserResponse createOfficer(@Valid @RequestBody CreateOfficerRequest request) {
        return adminManagementService.createOfficer(request);
    }

    @GetMapping("/users")
    public List<AdminUserResponse> users() {
        return adminManagementService.getUsers();
    }

    @GetMapping("/officers")
    public List<AdminUserResponse> officers(@RequestParam(required = false) String city) {
        return adminManagementService.getOfficers(city);
    }

    @GetMapping("/reports/excel")
    public void exportExcel(HttpServletResponse response) throws IOException {
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=complaints-report.xlsx");
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.getOutputStream().write(reportService.exportExcel());
    }

    @GetMapping(value = "/reports/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public void exportPdf(HttpServletResponse response) throws IOException {
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=complaints-report.pdf");
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.getOutputStream().write(reportService.exportPdf());
    }
}
