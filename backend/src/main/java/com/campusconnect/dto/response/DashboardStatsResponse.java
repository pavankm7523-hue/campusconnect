package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalStudents;
    private long totalRecruiters;
    private long totalCompanies;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long studentsPlaced;
    private long studentsNotPlaced;
    private double placementPercentage;
    private Map<String, Long> branchWiseStats;
}
