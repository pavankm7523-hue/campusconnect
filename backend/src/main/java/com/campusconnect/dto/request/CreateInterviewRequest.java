package com.campusconnect.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateInterviewRequest {
    private Long applicationId;
    private LocalDateTime scheduledAt;
    private String venue;
    private String interviewType;
}
