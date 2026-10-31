package com.campusconnect.service;

import com.campusconnect.dto.request.CreateJobRequest;
import com.campusconnect.dto.response.JobResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.entity.User;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.mapper.JobMapper;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.RecruiterRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobMapper jobMapper;

    @Transactional
    public JobResponse createJob(Long userId, CreateJobRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(company)
                .postedBy(recruiter)
                .minCgpa(request.getMinCgpa())
                .eligibleBranches(request.getEligibleBranches() != null
                        ? String.join(",", request.getEligibleBranches()) : null)
                .eligibleGraduationYears(request.getEligibleGraduationYears() != null
                        ? request.getEligibleGraduationYears().stream()
                                .map(String::valueOf).reduce((a, b) -> a + "," + b).orElse("") : null)
                .requiredSkills(request.getRequiredSkills() != null
                        ? String.join(",", request.getRequiredSkills()) : null)
                .packageOffered(request.getPackageOffered())
                .jobType(request.getJobType())
                .location(request.getLocation())
                .applicationDeadline(request.getApplicationDeadline())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.DRAFT)
                .totalPositions(request.getTotalPositions())
                .build();
        job = jobRepository.save(job);
        return jobMapper.toResponse(job);
    }

    @Transactional
    public JobResponse updateJob(Long userId, Long jobId, CreateJobRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setMinCgpa(request.getMinCgpa());
        job.setEligibleBranches(request.getEligibleBranches() != null
                ? String.join(",", request.getEligibleBranches()) : null);
        job.setEligibleGraduationYears(request.getEligibleGraduationYears() != null
                ? request.getEligibleGraduationYears().stream()
                        .map(String::valueOf).reduce((a, b) -> a + "," + b).orElse("") : null);
        job.setRequiredSkills(request.getRequiredSkills() != null
                ? String.join(",", request.getRequiredSkills()) : null);
        job.setPackageOffered(request.getPackageOffered());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }
        job.setTotalPositions(request.getTotalPositions());
        job = jobRepository.save(job);
        return jobMapper.toResponse(job);
    }

    @Transactional
    public void deleteJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }
        jobRepository.delete(job);
    }

    public PagedResponse<JobResponse> getAllJobs(String status, String branch, String search, Pageable pageable) {
        JobStatus jobStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                jobStatus = JobStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                jobStatus = null;
            }
        }
        Page<Job> page = jobRepository.searchJobs(jobStatus, search, pageable);
        return PagedResponse.<JobResponse>builder()
                .content(page.getContent().stream().map(jobMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        return jobMapper.toResponse(job);
    }

    public PagedResponse<JobResponse> getJobsForCompany(Long companyId, Pageable pageable) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        Page<Job> page = jobRepository.findByCompany(company, pageable);
        return PagedResponse.<JobResponse>builder()
                .content(page.getContent().stream().map(jobMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
