package com.campusconnect.controller;

import com.campusconnect.dto.response.*;
import com.campusconnect.service.AdminService;
import com.campusconnect.service.CompanyService;
import com.campusconnect.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public", description = "Public facing discovery endpoints")
public class PublicController {

    private final AdminService adminService;
    private final CompanyService companyService;
    private final JobService jobService;

    @GetMapping("/stats")
    @Operation(summary = "Get platform placement statistics for landing page")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/companies")
    @Operation(summary = "Get visiting partner companies")
    public ResponseEntity<ApiResponse<PagedResponse<CompanyResponse>>> getCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CompanyResponse> response = companyService.getAllCompanies(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get open campus jobs for public view")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PagedResponse<JobResponse> response = jobService.getAllJobs("OPEN", null, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
