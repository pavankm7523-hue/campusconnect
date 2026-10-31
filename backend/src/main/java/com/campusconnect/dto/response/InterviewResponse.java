package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String studentName;
    private String jobTitle;
    private String companyName;
    private LocalDateTime scheduledAt;
    private String venue;
    private String interviewType;
    private String interviewerNotes;
    private String outcome;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
