package com.smartcivic.cms.complaint;

import com.smartcivic.cms.complaint.dto.ComplaintRequest;
import com.smartcivic.cms.complaint.dto.ComplaintResponse;
import com.smartcivic.cms.complaint.dto.RatingRequest;
import com.smartcivic.cms.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ComplaintResponse createComplaint(@AuthenticationPrincipal User user, @Valid @RequestBody ComplaintRequest request) {
        return complaintService.createComplaint(user.getId(), request);
    }

    @GetMapping("/mine")
    public List<ComplaintResponse> getMine(@AuthenticationPrincipal User user) {
        return complaintService.getComplaintsForUser(user.getId());
    }

    @GetMapping("/{id}")
    public ComplaintResponse getOne(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return complaintService.getComplaint(id, user.getId(), false);
    }

    @PutMapping("/{id}/reopen")
    public ComplaintResponse reopen(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return complaintService.reopenComplaint(id, user.getId());
    }

    @PutMapping("/{id}/rating")
    public ComplaintResponse rate(@PathVariable Long id,
                                  @AuthenticationPrincipal User user,
                                  @Valid @RequestBody RatingRequest request) {
        return complaintService.rateComplaint(id, user.getId(), request);
    }
}
