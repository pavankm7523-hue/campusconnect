package com.campusconnect.mapper;

import com.campusconnect.dto.response.JobResponse;
import com.campusconnect.entity.Job;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JobMapper {

    public JobResponse toResponse(Job job) {
        return toResponse(job, false, false);
    }

    public JobResponse toResponse(Job job, boolean applied, boolean eligible) {
        if (job == null) return null;
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyId(job.getCompany() != null ? job.getCompany().getId() : null)
                .companyName(job.getCompany() != null ? job.getCompany().getName() : null)
                .minCgpa(job.getMinCgpa())
                .eligibleBranches(parseCommaSeparated(job.getEligibleBranches()))
                .eligibleGraduationYears(parseIntList(job.getEligibleGraduationYears()))
                .requiredSkills(parseCommaSeparated(job.getRequiredSkills()))
                .packageOffered(job.getPackageOffered())
                .jobType(job.getJobType())
                .location(job.getLocation())
                .applicationDeadline(job.getApplicationDeadline())
                .status(job.getStatus())
                .totalPositions(job.getTotalPositions())
                .applied(applied)
                .eligible(eligible)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public List<String> parseCommaSeparated(String value) {
        if (value == null || value.isBlank()) return Collections.emptyList();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public List<Integer> parseIntList(String value) {
        if (value == null || value.isBlank()) return Collections.emptyList();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
    }

    public String toCommaSeparated(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return String.join(",", list);
    }

    public String intListToCommaSeparated(List<Integer> list) {
        if (list == null || list.isEmpty()) return "";
        return list.stream().map(String::valueOf).collect(Collectors.joining(","));
    }
}
