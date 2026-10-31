package com.campusconnect.controller;

import com.campusconnect.dto.request.StudentProfileRequest;
import com.campusconnect.dto.response.*;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Tag(name = "Student", description = "Student portal endpoints")
public class StudentController {

    private final StudentService studentService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get student dashboard statistics and recent data")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getDashboard(
            @AuthenticationPrincipal User currentUser) {
        StudentDashboardResponse response = studentService.getDashboard(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current student profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(
            @AuthenticationPrincipal User currentUser) {
        StudentProfileResponse response = studentService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current student profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody StudentProfileRequest request) {
        StudentProfileResponse response = studentService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload or replace student resume")
    public ResponseEntity<ApiResponse<String>> uploadResume(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file) throws IOException {
        String resumeUrl = studentService.uploadResume(currentUser.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", resumeUrl));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Browse open jobs with filters and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getJobs(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> response = jobService.getAllJobs("OPEN", branch, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/jobs/{jobId}")
    @Operation(summary = "Get detailed information for a specific job")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long jobId) {
        JobResponse response = jobService.getJobById(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/jobs/{jobId}/eligibility")
    @Operation(summary = "Check student eligibility for a job")
    public ResponseEntity<ApiResponse<EligibilityResponse>> checkEligibility(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        Student student = studentService.getStudentByUserId(currentUser.getId());
        EligibilityResponse response = eligibilityService.checkEligibility(student.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/applications/{jobId}")
    @Operation(summary = "Apply for a job")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        ApplicationResponse response = applicationService.applyForJob(currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/applications")
    @Operation(summary = "Get applications submitted by current student")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplications(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationResponse> response = applicationService.getMyApplications(currentUser.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/applications/{applicationId}")
    @Operation(summary = "Withdraw an application (if still in APPLIED status)")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long applicationId) {
        applicationService.withdrawApplication(currentUser.getId(), applicationId);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully"));
    }

    @GetMapping("/interviews")
    @Operation(summary = "Get scheduled interviews for current student")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviews(
            @AuthenticationPrincipal User currentUser) {
        List<InterviewResponse> response = studentService.getMyInterviews(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get notifications for current student")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal User currentUser) {
        List<NotificationResponse> response = notificationService.getMyNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/notifications/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        notificationService.markAsRead(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @PutMapping("/notifications/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsRead(
            @AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @GetMapping("/notifications/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal User currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/placement-result")
    @Operation(summary = "Get placement result for current student")
    public ResponseEntity<ApiResponse<PlacementResultResponse>> getPlacementResult(
            @AuthenticationPrincipal User currentUser) {
        PlacementResultResponse response = studentService.getMyPlacementResult(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
