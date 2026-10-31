package com.campusconnect.controller;

import com.campusconnect.dto.request.ApplicationStatusRequest;
import com.campusconnect.dto.request.CreateCompanyRequest;
import com.campusconnect.dto.request.CreateDriveRequest;
import com.campusconnect.dto.response.*;
import com.campusconnect.entity.RecruitmentDrive;
import com.campusconnect.entity.User;
import com.campusconnect.enums.Role;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Training & Placement Cell Admin endpoints")
public class AdminController {

    private final AdminService adminService;
    private final CompanyService companyService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final RecruitmentDriveService driveService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level placement dashboard KPIs and charts")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/students")
    @Operation(summary = "Get all registered students with search and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<StudentProfileResponse>>> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<StudentProfileResponse> response = adminService.getAllStudents(search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/students/{id}")
    @Operation(summary = "Get detailed profile of a student by ID")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentById(@PathVariable Long id) {
        StudentProfileResponse response = adminService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recruiters")
    @Operation(summary = "Get all recruiters with verification status")
    public ResponseEntity<ApiResponse<PagedResponse<RecruiterProfileResponse>>> getRecruiters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RecruiterProfileResponse> response = adminService.getAllRecruiters(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/recruiters/{id}/approve")
    @Operation(summary = "Approve recruiter account for campus access")
    public ResponseEntity<ApiResponse<Void>> approveRecruiter(@PathVariable Long id) {
        adminService.approveRecruiter(id);
        return ResponseEntity.ok(ApiResponse.success("Recruiter approved successfully"));
    }

    @GetMapping("/companies")
    @Operation(summary = "Get all registered partner companies")
    public ResponseEntity<ApiResponse<PagedResponse<CompanyResponse>>> getCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<CompanyResponse> response = companyService.getAllCompanies(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/companies")
    @Operation(summary = "Register a new partner company")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CreateCompanyRequest request) {
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.ok(ApiResponse.success("Company created successfully", response));
    }

    @PutMapping("/companies/{id}")
    @Operation(summary = "Update company details")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CreateCompanyRequest request) {
        CompanyResponse response = companyService.updateCompany(id, request);
        return ResponseEntity.ok(ApiResponse.success("Company updated successfully", response));
    }

    @DeleteMapping("/companies/{id}")
    @Operation(summary = "Delete partner company")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted successfully"));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all jobs posted across the campus")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> response = jobService.getAllJobs(null, null, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/applications")
    @Operation(summary = "Get all student applications across all drives")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationResponse> response = adminService.getAllApplications(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/applications/{id}/status")
    @Operation(summary = "Update application status from admin desk")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request) {
        ApplicationResponse response = applicationService.updateApplicationStatus(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", response));
    }

    @GetMapping("/placement-results")
    @Operation(summary = "Get all placement records")
    public ResponseEntity<ApiResponse<PagedResponse<PlacementResultResponse>>> getPlacementResults(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PlacementResultResponse> response = adminService.getPlacementResults(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Data
    public static class PlacementResultDto {
        private Long studentId;
        private Long jobId;
        private String packageOffered;
        private String joiningDate;
        private String status;
    }

    @PostMapping("/placement-results")
    @Operation(summary = "Record or update final placement selection")
    public ResponseEntity<ApiResponse<PlacementResultResponse>> createPlacementResult(
            @RequestBody PlacementResultDto request) {
        PlacementResultResponse response = adminService.createOrUpdatePlacementResult(
                request.getStudentId(),
                request.getJobId(),
                request.getPackageOffered(),
                request.getJoiningDate(),
                request.getStatus()
        );
        return ResponseEntity.ok(ApiResponse.success("Placement recorded successfully", response));
    }

    @GetMapping("/drives")
    @Operation(summary = "Get all recruitment drives")
    public ResponseEntity<ApiResponse<PagedResponse<RecruitmentDrive>>> getDrives(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RecruitmentDrive> response = driveService.getAllDrives(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/drives")
    @Operation(summary = "Create a new campus recruitment drive")
    public ResponseEntity<ApiResponse<RecruitmentDrive>> createDrive(
            @Valid @RequestBody CreateDriveRequest request) {
        RecruitmentDrive drive = driveService.createDrive(request);
        return ResponseEntity.ok(ApiResponse.success("Drive created successfully", drive));
    }

    @PutMapping("/drives/{id}/status")
    @Operation(summary = "Update drive status (ACTIVE / UPCOMING / COMPLETED)")
    public ResponseEntity<ApiResponse<RecruitmentDrive>> updateDriveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACTIVE");
        RecruitmentDrive drive = driveService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Drive status updated", drive));
    }

    @GetMapping("/export/students")
    @Operation(summary = "Export all student records to CSV")
    public ResponseEntity<byte[]> exportStudents() {
        List<StudentProfileResponse> students = adminService.exportStudentReport();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Full Name,Roll Number,Branch,CGPA,Graduation Year,Phone,Email,Profile Complete\n");
        for (StudentProfileResponse s : students) {
            csv.append(s.getId()).append(",")
                    .append("\"").append(s.getFullName() != null ? s.getFullName().replace("\"", "\"\"") : "").append("\",")
                    .append("\"").append(s.getRollNumber() != null ? s.getRollNumber().replace("\"", "\"\"") : "").append("\",")
                    .append("\"").append(s.getBranch() != null ? s.getBranch().replace("\"", "\"\"") : "").append("\",")
                    .append(s.getCgpa() != null ? s.getCgpa() : "").append(",")
                    .append(s.getGraduationYear() != null ? s.getGraduationYear() : "").append(",")
                    .append("\"").append(s.getPhone() != null ? s.getPhone().replace("\"", "\"\"") : "").append("\",")
                    .append("\"").append(s.getEmail() != null ? s.getEmail().replace("\"", "\"\"") : "").append("\",")
                    .append(s.getProfileComplete()).append("\n");
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @Data
    public static class AdminNotificationRequest {
        private String recipientType;
        private String targetEmail;
        private Long userId;
        private String title;
        private String message;
        private String type;
    }

    @PostMapping("/notifications/send")
    @Operation(summary = "Dispatch notifications to users (broadcast or targeted)")
    public ResponseEntity<ApiResponse<Void>> sendNotification(@RequestBody AdminNotificationRequest request) {
        String type = request.getType() != null ? request.getType() : "INFO";
        String recipientType = request.getRecipientType() != null ? request.getRecipientType() : "BROADCAST_ALL";

        if ("INDIVIDUAL".equalsIgnoreCase(recipientType)) {
            if (request.getTargetEmail() != null && !request.getTargetEmail().isBlank()) {
                userRepository.findByEmail(request.getTargetEmail().trim())
                        .ifPresent(u -> notificationService.sendNotification(u.getId(), request.getTitle(), request.getMessage(), type));
            } else if (request.getUserId() != null) {
                notificationService.sendNotification(request.getUserId(), request.getTitle(), request.getMessage(), type);
            }
        } else if ("STUDENTS_ONLY".equalsIgnoreCase(recipientType)) {
            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.STUDENT)
                    .toList();
            students.forEach(u -> notificationService.sendNotification(u.getId(), request.getTitle(), request.getMessage(), type));
        } else if ("RECRUITERS_ONLY".equalsIgnoreCase(recipientType)) {
            List<User> recruiters = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.RECRUITER)
                    .toList();
            recruiters.forEach(u -> notificationService.sendNotification(u.getId(), request.getTitle(), request.getMessage(), type));
        } else {
            // BROADCAST_ALL
            List<User> all = userRepository.findAll();
            all.forEach(u -> notificationService.sendNotification(u.getId(), request.getTitle(), request.getMessage(), type));
        }

        return ResponseEntity.ok(ApiResponse.success("Notification dispatched successfully"));
    }
}
