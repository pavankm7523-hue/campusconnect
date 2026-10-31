package com.campusconnect.service;

import com.campusconnect.dto.request.ApplicationStatusRequest;
import com.campusconnect.dto.request.CreateInterviewRequest;
import com.campusconnect.dto.request.InterviewOutcomeRequest;
import com.campusconnect.dto.response.ApplicationResponse;
import com.campusconnect.dto.response.InterviewResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.dto.response.RecruiterProfileResponse;
import com.campusconnect.entity.Application;
import com.campusconnect.entity.Interview;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.entity.User;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.mapper.ApplicationMapper;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.InterviewRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.RecruiterRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final ApplicationMapper applicationMapper;

    public RecruiterProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        return toResponse(recruiter);
    }

    public PagedResponse<ApplicationResponse> getMyJobs(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Page<Job> jobs = jobRepository.findByPostedBy(recruiter, pageable);
        // Return applications across all jobs
        List<Application> allApps = jobs.getContent().stream()
                .flatMap(job -> applicationRepository.findByJob(job).stream())
                .toList();
        List<ApplicationResponse> responses = allApps.stream().map(applicationMapper::toResponse).toList();
        return PagedResponse.<ApplicationResponse>builder()
                .content(responses)
                .page(0)
                .size(responses.size())
                .totalElements(responses.size())
                .totalPages(1)
                .build();
    }

    public PagedResponse<com.campusconnect.dto.response.JobResponse> getMyJobsList(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Page<Job> page = jobRepository.findByPostedBy(recruiter, pageable);
        com.campusconnect.mapper.JobMapper jobMapper = new com.campusconnect.mapper.JobMapper();
        return PagedResponse.<com.campusconnect.dto.response.JobResponse>builder()
                .content(page.getContent().stream().map(jobMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public PagedResponse<ApplicationResponse> getApplicantsForJob(Long userId, Long jobId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to view applicants for this job");
        }
        Page<Application> page = applicationRepository.findByJob(job, pageable);
        return PagedResponse.<ApplicationResponse>builder()
                .content(page.getContent().stream().map(applicationMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional
    public ApplicationResponse shortlistApplication(Long userId, Long applicationId) {
        verifyRecruiterOwnsApplication(userId, applicationId);
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        application.setStatus(ApplicationStatus.SHORTLISTED);
        application = applicationRepository.save(application);
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public ApplicationResponse rejectApplication(Long userId, Long applicationId, String notes) {
        verifyRecruiterOwnsApplication(userId, applicationId);
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        application.setStatus(ApplicationStatus.REJECTED);
        application.setNotes(notes);
        application = applicationRepository.save(application);
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public InterviewResponse scheduleInterview(Long userId, CreateInterviewRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));
        verifyRecruiterOwnsJob(userId, application.getJob().getId());

        Interview interview = Interview.builder()
                .application(application)
                .scheduledAt(request.getScheduledAt())
                .venue(request.getVenue())
                .interviewType(request.getInterviewType())
                .outcome("PENDING")
                .build();
        interview = interviewRepository.save(interview);
        return toInterviewResponse(interview);
    }

    @Transactional
    public InterviewResponse updateInterviewOutcome(Long userId, Long interviewId, InterviewOutcomeRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));
        verifyRecruiterOwnsJob(userId, interview.getApplication().getJob().getId());
        interview.setOutcome(request.getOutcome());
        if (request.getNotes() != null) {
            interview.setInterviewerNotes(request.getNotes());
        }
        interview = interviewRepository.save(interview);
        return toInterviewResponse(interview);
    }

    public List<InterviewResponse> getMyInterviews(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        List<Job> jobs = jobRepository.findByPostedBy(recruiter);
        List<Application> allApps = jobs.stream()
                .flatMap(job -> applicationRepository.findByJob(job).stream())
                .toList();
        return interviewRepository.findByApplicationIn(allApps).stream()
                .map(this::toInterviewResponse)
                .toList();
    }

    private void verifyRecruiterOwnsApplication(Long userId, Long applicationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        if (!application.getJob().getPostedBy().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("Not authorized for this application");
        }
    }

    private void verifyRecruiterOwnsJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("Not authorized for this job");
        }
    }

    private RecruiterProfileResponse toResponse(Recruiter recruiter) {
        return RecruiterProfileResponse.builder()
                .id(recruiter.getId())
                .userId(recruiter.getUser().getId())
                .email(recruiter.getUser().getEmail())
                .fullName(recruiter.getFullName())
                .designation(recruiter.getDesignation())
                .phone(recruiter.getPhone())
                .companyId(recruiter.getCompany() != null ? recruiter.getCompany().getId() : null)
                .companyName(recruiter.getCompany() != null ? recruiter.getCompany().getName() : null)
                .approved(recruiter.getApproved())
                .createdAt(recruiter.getCreatedAt())
                .updatedAt(recruiter.getUpdatedAt())
                .build();
    }

    private InterviewResponse toInterviewResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .studentName(interview.getApplication().getStudent().getFullName())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .companyName(interview.getApplication().getJob().getCompany() != null
                        ? interview.getApplication().getJob().getCompany().getName() : null)
                .scheduledAt(interview.getScheduledAt())
                .venue(interview.getVenue())
                .interviewType(interview.getInterviewType())
                .interviewerNotes(interview.getInterviewerNotes())
                .outcome(interview.getOutcome())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }
}
