package com.campusconnect.dto.response;

import com.campusconnect.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String rollNumber;
    private Double cgpa;
    private String branch;
    private String resumeUrl;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private String notes;
}
