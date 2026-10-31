package com.campusconnect.dto.response;

import com.campusconnect.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private Long companyId;
    private String companyName;
    private Double minCgpa;
    private List<String> eligibleBranches;
    private List<Integer> eligibleGraduationYears;
    private List<String> requiredSkills;
    private String packageOffered;
    private String jobType;
    private String location;
    private LocalDate applicationDeadline;
    private JobStatus status;
    private Integer totalPositions;
    private boolean applied;
    private boolean eligible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
