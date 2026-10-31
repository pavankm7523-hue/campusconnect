package com.campusconnect.controller;

import com.campusconnect.dto.request.ApplicationStatusRequest;
import com.campusconnect.dto.request.CreateInterviewRequest;
import com.campusconnect.dto.request.CreateJobRequest;
import com.campusconnect.dto.request.InterviewOutcomeRequest;
import com.campusconnect.dto.response.*;
import com.campusconnect.entity.User;
import com.campusconnect.service.JobService;
import com.campusconnect.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@Tag(name = "Recruiter", description = "Recruiter portal endpoints")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;

    @GetMapping("/profile")
    @Operation(summary = "Get current recruiter profile")
    public ResponseEntity<ApiResponse<RecruiterProfileResponse>> getProfile(
            @AuthenticationPrincipal User currentUser) {
        RecruiterProfileResponse response = recruiterService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get jobs posted by current recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getJobs(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> response = recruiterService.getMyJobsList(currentUser.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Post a new job opening")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateJobRequest request) {
        JobResponse response = jobService.createJob(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Job created successfully", response));
    }

    @PutMapping("/jobs/{id}")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @Valid @RequestBody CreateJobRequest request) {
        JobResponse response = jobService.updateJob(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", response));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Delete a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        jobService.deleteJob(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully"));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    @Operation(summary = "Get applicants for a specific job")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplicants(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationResponse> response = recruiterService.getApplicantsForJob(currentUser.getId(), jobId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/applications/{id}/shortlist")
    @Operation(summary = "Shortlist an applicant")
    public ResponseEntity<ApiResponse<ApplicationResponse>> shortlistApplication(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        ApplicationResponse response = recruiterService.shortlistApplication(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Application shortlisted successfully", response));
    }

    @PutMapping("/applications/{id}/reject")
    @Operation(summary = "Reject an applicant with optional notes")
    public ResponseEntity<ApiResponse<ApplicationResponse>> rejectApplication(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody(required = false) ApplicationStatusRequest request) {
        String notes = (request != null) ? request.getNotes() : null;
        ApplicationResponse response = recruiterService.rejectApplication(currentUser.getId(), id, notes);
        return ResponseEntity.ok(ApiResponse.success("Application rejected", response));
    }

    @PostMapping("/interviews")
    @Operation(summary = "Schedule an interview for an applicant")
    public ResponseEntity<ApiResponse<InterviewResponse>> scheduleInterview(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateInterviewRequest request) {
        InterviewResponse response = recruiterService.scheduleInterview(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Interview scheduled successfully", response));
    }

    @PutMapping("/interviews/{id}/outcome")
    @Operation(summary = "Update interview outcome (PASSED / FAILED / PENDING)")
    public ResponseEntity<ApiResponse<InterviewResponse>> updateInterviewOutcome(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @Valid @RequestBody InterviewOutcomeRequest request) {
        InterviewResponse response = recruiterService.updateInterviewOutcome(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Interview outcome updated successfully", response));
    }

    @GetMapping("/interviews")
    @Operation(summary = "Get all interviews scheduled by current recruiter")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviews(
            @AuthenticationPrincipal User currentUser) {
        List<InterviewResponse> response = recruiterService.getMyInterviews(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
