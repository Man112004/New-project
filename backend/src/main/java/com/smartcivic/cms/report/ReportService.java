package com.smartcivic.cms.report;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.smartcivic.cms.common.ComplaintCategory;
import com.smartcivic.cms.common.ComplaintStatus;
import com.smartcivic.cms.complaint.Complaint;
import com.smartcivic.cms.complaint.ComplaintMapper;
import com.smartcivic.cms.complaint.ComplaintRepository;
import com.smartcivic.cms.complaint.ComplaintUpdateRepository;
import com.smartcivic.cms.complaint.dto.ComplaintResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final ComplaintMapper complaintMapper;

    public DashboardSummary getSummary() {
        List<Complaint> complaints = complaintRepository.findAll();
        Map<String, Long> byCategory = Arrays.stream(ComplaintCategory.values())
                .collect(Collectors.toMap(Enum::name, complaintRepository::countByCategory, (a, b) -> a, LinkedHashMap::new));
        Map<String, Long> byDepartment = complaints.stream()
                .collect(Collectors.groupingBy(
                        complaint -> complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Unassigned",
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
        Map<String, Long> byCity = complaints.stream()
                .collect(Collectors.groupingBy(Complaint::getCity, LinkedHashMap::new, Collectors.counting()));
        Map<String, Long> byWard = complaints.stream()
                .collect(Collectors.groupingBy(
                        complaint -> complaint.getWard() == null || complaint.getWard().isBlank() ? "Unassigned Ward" : complaint.getWard(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
        List<ComplaintResponse> recentComplaints = complaints.stream()
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .limit(8)
                .map(this::toResponse)
                .toList();
        return new DashboardSummary(
                complaints.size(),
                complaintRepository.countByStatus(ComplaintStatus.PENDING) + complaintRepository.countByStatus(ComplaintStatus.REOPENED),
                complaintRepository.countByStatus(ComplaintStatus.ASSIGNED) + complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS),
                complaintRepository.countByStatus(ComplaintStatus.RESOLVED),
                byCategory,
                byDepartment,
                byCity,
                byWard,
                recentComplaints
        );
    }

    public ReportsResponse getReports() {
        DashboardSummary summary = getSummary();
        return new ReportsResponse(summary, summary.byDepartment(), summary.byCategory());
    }

    public byte[] exportExcel() {
        List<Complaint> complaints = complaintRepository.findAll();
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Complaints");
            String[] columns = {"ID", "Citizen", "Category", "Title", "Status", "Priority", "Department", "City", "Ward", "Created"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            int rowIndex = 1;
            for (Complaint complaint : complaints) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(complaint.getId());
                row.createCell(1).setCellValue(complaint.getUser().getName());
                row.createCell(2).setCellValue(complaint.getCategory().name());
                row.createCell(3).setCellValue(complaint.getTitle());
                row.createCell(4).setCellValue(complaint.getStatus().name());
                row.createCell(5).setCellValue(complaint.getPriority().name());
                row.createCell(6).setCellValue(complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Unassigned");
                row.createCell(7).setCellValue(complaint.getCity());
                row.createCell(8).setCellValue(complaint.getWard() == null ? "" : complaint.getWard());
                row.createCell(9).setCellValue(String.valueOf(complaint.getCreatedAt()));
            }
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate excel report");
        }
    }

    public byte[] exportPdf() {
        List<Complaint> complaints = complaintRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Smart Civic Complaint Management Report"));
            document.add(new Paragraph("Total complaints: " + complaints.size()));
            document.add(new Paragraph("Resolved complaints: " + complaintRepository.countByStatus(ComplaintStatus.RESOLVED)));
            document.add(new Paragraph(" "));
            for (Complaint complaint : complaints) {
                document.add(new Paragraph("#" + complaint.getId() + " | " + complaint.getCategory().name()
                        + " | " + complaint.getStatus().name() + " | " + complaint.getTitle()));
            }
            document.close();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate pdf report");
        }
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        return complaintMapper.toResponse(
                complaint,
                complaintUpdateRepository.findByComplaintIdOrderByUpdatedAtDesc(complaint.getId())
        );
    }
}
