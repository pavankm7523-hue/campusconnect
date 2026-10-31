package com.campusconnect.service;

import com.campusconnect.dto.response.EligibilityResponse;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public EligibilityResponse checkEligibility(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        List<String> satisfied = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // CGPA check
        if (job.getMinCgpa() != null) {
            if (student.getCgpa() != null && student.getCgpa() >= job.getMinCgpa()) {
                satisfied.add("CGPA >= " + job.getMinCgpa() + " (yours: " + student.getCgpa() + ")");
            } else {
                failed.add("CGPA >= " + job.getMinCgpa() + " required (yours: " + student.getCgpa() + ")");
            }
        } else {
            satisfied.add("No minimum CGPA requirement");
        }

        // Branch check
        if (job.getEligibleBranches() != null && !job.getEligibleBranches().isBlank()) {
            List<String> branches = Arrays.stream(job.getEligibleBranches().split(","))
                    .map(String::trim)
                    .toList();
            if (student.getBranch() != null && branches.contains(student.getBranch().trim())) {
                satisfied.add("Branch '" + student.getBranch() + "' is eligible");
            } else {
                failed.add("Branch '" + student.getBranch() + "' not in eligible list: " + branches);
            }
        } else {
            satisfied.add("All branches eligible");
        }

        // Graduation year check
        if (job.getEligibleGraduationYears() != null && !job.getEligibleGraduationYears().isBlank()) {
            List<Integer> years = Arrays.stream(job.getEligibleGraduationYears().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Integer::parseInt)
                    .toList();
            if (student.getGraduationYear() != null && years.contains(student.getGraduationYear())) {
                satisfied.add("Graduation year " + student.getGraduationYear() + " is eligible");
            } else {
                failed.add("Graduation year " + student.getGraduationYear() + " not in eligible list: " + years);
            }
        } else {
            satisfied.add("All graduation years eligible");
        }

        // Skills check
        if (job.getRequiredSkills() != null && !job.getRequiredSkills().isBlank()) {
            List<String> requiredSkills = Arrays.stream(job.getRequiredSkills().split(","))
                    .map(s -> s.trim().toLowerCase())
                    .toList();
            List<String> studentSkills = (student.getSkills() != null && !student.getSkills().isBlank())
                    ? Arrays.stream(student.getSkills().split(","))
                            .map(s -> s.trim().toLowerCase())
                            .toList()
                    : List.of();
            boolean hasAllSkills = studentSkills.containsAll(requiredSkills);
            if (hasAllSkills) {
                satisfied.add("Has all required skills: " + requiredSkills);
            } else {
                List<String> missing = requiredSkills.stream()
                        .filter(skill -> !studentSkills.contains(skill))
                        .toList();
                failed.add("Missing required skills: " + missing);
            }
        } else {
            satisfied.add("No specific skills required");
        }

        boolean eligible = failed.isEmpty();
        return EligibilityResponse.builder()
                .jobId(jobId)
                .eligible(eligible)
                .satisfiedCriteria(satisfied)
                .failedCriteria(failed)
                .build();
    }

    public boolean isEligible(Long studentId, Long jobId) {
        EligibilityResponse response = checkEligibility(studentId, jobId);
        return response.isEligible();
    }
}
