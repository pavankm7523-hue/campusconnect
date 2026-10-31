package com.campusconnect.dto.request;

import com.campusconnect.enums.JobStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateJobRequest {
    private String title;
    private String description;
    private Long companyId;
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
}
