package com.campusconnect.service;

import com.campusconnect.dto.request.ApplicationStatusRequest;
import com.campusconnect.dto.response.ApplicationResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.entity.Application;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.mapper.ApplicationMapper;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EligibilityService eligibilityService;
    private final ApplicationMapper applicationMapper;

    @Transactional
    public ApplicationResponse applyForJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException("This job is not accepting applications");
        }
        if (applicationRepository.existsByJobAndStudent(job, student)) {
            throw new DuplicateResourceException("You have already applied for this job");
        }
        if (!eligibilityService.isEligible(student.getId(), jobId)) {
            throw new IllegalArgumentException("You are not eligible for this job");
        }

        Application application = Application.builder()
                .job(job)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .build();
        application = applicationRepository.save(application);
        return applicationMapper.toResponse(application);
    }

    public PagedResponse<ApplicationResponse> getMyApplications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<Application> page = applicationRepository.findByStudent(student, pageable);
        return PagedResponse.<ApplicationResponse>builder()
                .content(page.getContent().stream().map(applicationMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public void withdrawApplication(Long userId, Long applicationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getStudent().getId().equals(student.getId())) {
            throw new UnauthorizedException("Not your application");
        }
        if (application.getStatus() != ApplicationStatus.APPLIED) {
            throw new IllegalArgumentException("Cannot withdraw application in status: " + application.getStatus());
        }
        applicationRepository.delete(application);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long userId, Long applicationId, ApplicationStatusRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }
        application = applicationRepository.save(application);
        return applicationMapper.toResponse(application);
    }
}
