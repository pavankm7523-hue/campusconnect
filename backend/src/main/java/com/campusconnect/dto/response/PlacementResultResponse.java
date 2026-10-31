package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long companyId;
    private String companyName;
    private Long jobId;
    private String jobTitle;
    private String packageOffered;
    private LocalDate joiningDate;
    private String status;
    private LocalDateTime createdAt;
}
