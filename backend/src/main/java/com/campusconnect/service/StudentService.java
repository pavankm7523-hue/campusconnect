package com.campusconnect.service;

import com.campusconnect.dto.request.StudentProfileRequest;
import com.campusconnect.dto.response.InterviewResponse;
import com.campusconnect.dto.response.JobResponse;
import com.campusconnect.dto.response.NotificationResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.dto.response.PlacementResultResponse;
import com.campusconnect.dto.response.StudentDashboardResponse;
import com.campusconnect.dto.response.StudentProfileResponse;
import com.campusconnect.entity.Application;
import com.campusconnect.entity.Interview;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.PlacementResult;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.mapper.JobMapper;
import com.campusconnect.mapper.StudentMapper;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.InterviewRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.PlacementResultRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final PlacementResultRepository placementResultRepository;
    private final NotificationService notificationService;
    private final EligibilityService eligibilityService;
    private final StudentMapper studentMapper;
    private final JobMapper jobMapper;

    public StudentProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return studentMapper.toResponse(student);
    }

    @Transactional
    public StudentProfileResponse updateProfile(Long userId, StudentProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (request.getFullName() != null) student.setFullName(request.getFullName());
        if (request.getRollNumber() != null) student.setRollNumber(request.getRollNumber());
        if (request.getBranch() != null) student.setBranch(request.getBranch());
        if (request.getCgpa() != null) student.setCgpa(request.getCgpa());
        if (request.getGraduationYear() != null) student.setGraduationYear(request.getGraduationYear());
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getSkills() != null) {
            student.setSkills(String.join(",", request.getSkills()));
        }

        boolean complete = student.getFullName() != null && !student.getFullName().isBlank()
                && student.getRollNumber() != null && !student.getRollNumber().isBlank()
                && student.getBranch() != null && !student.getBranch().isBlank()
                && student.getCgpa() != null
                && student.getGraduationYear() != null
                && student.getPhone() != null && !student.getPhone().isBlank();
        student.setProfileComplete(complete);

        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    @Transactional
    public String uploadResume(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        String uploadDir = "uploads/resumes/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
        String filename = "resume_" + userId + "_" + UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        student.setResumeUrl("/api/files/" + filename);
        studentRepository.save(student);
        return student.getResumeUrl();
    }

    public PagedResponse<JobResponse> getEligibleJobs(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Page<Job> allOpenJobs = jobRepository.findByStatus(JobStatus.OPEN, pageable);
        List<JobResponse> eligibleJobs = allOpenJobs.getContent().stream()
                .filter(job -> eligibilityService.isEligible(student.getId(), job.getId()))
                .map(job -> {
                    boolean applied = applicationRepository.existsByJobAndStudent(job, student);
                    return jobMapper.toResponse(job, applied, true);
                })
                .toList();

        return PagedResponse.<JobResponse>builder()
                .content(eligibleJobs)
                .page(allOpenJobs.getNumber())
                .size(allOpenJobs.getSize())
                .totalElements(eligibleJobs.size())
                .totalPages(allOpenJobs.getTotalPages())
                .build();
    }

    public StudentDashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        long totalApplications = applicationRepository.findByStudent(student).size();
        long shortlisted = applicationRepository.findByStudentAndStatus(student, ApplicationStatus.SHORTLISTED).size();

        List<Application> applications = applicationRepository.findByStudent(student);
        List<Interview> interviews = interviewRepository.findByApplicationIn(applications);
        long upcomingInterviews = interviews.stream()
                .filter(i -> "PENDING".equals(i.getOutcome()) && i.getScheduledAt() != null
                        && i.getScheduledAt().isAfter(LocalDateTime.now()))
                .count();

        List<NotificationResponse> recentNotifications = notificationService.getMyNotifications(userId)
                .stream().limit(5).toList();

        long eligibleJobCount = jobRepository.findByStatus(JobStatus.OPEN, Pageable.unpaged())
                .getContent().stream()
                .filter(job -> eligibilityService.isEligible(student.getId(), job.getId()))
                .count();

        return StudentDashboardResponse.builder()
                .profileComplete(student.getProfileComplete())
                .eligibleJobCount(eligibleJobCount)
                .totalApplications(totalApplications)
                .shortlistedCount(shortlisted)
                .upcomingInterviews(upcomingInterviews)
                .recentNotifications(recentNotifications)
                .build();
    }

    public PlacementResultResponse getMyPlacementResult(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        PlacementResult result = placementResultRepository.findByStudent(student)
                .orElseThrow(() -> new ResourceNotFoundException("Placement result not found"));
        return toPlacementResponse(result);
    }

    public Student getStudentByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    public List<InterviewResponse> getMyInterviews(Long userId) {
        Student student = getStudentByUserId(userId);
        return interviewRepository.findByApplicationStudent(student).stream()
                .map(this::toInterviewResponse)
                .toList();
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

    private PlacementResultResponse toPlacementResponse(PlacementResult r) {
        return PlacementResultResponse.builder()
                .id(r.getId())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getFullName())
                .rollNumber(r.getStudent().getRollNumber())
                .companyId(r.getCompany() != null ? r.getCompany().getId() : null)
                .companyName(r.getCompany() != null ? r.getCompany().getName() : null)
                .jobId(r.getJob() != null ? r.getJob().getId() : null)
                .jobTitle(r.getJob() != null ? r.getJob().getTitle() : null)
                .packageOffered(r.getPackageOffered())
                .joiningDate(r.getJoiningDate())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
