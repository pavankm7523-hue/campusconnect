package com.campusconnect.service;

import com.campusconnect.dto.request.CreateDriveRequest;
import com.campusconnect.dto.response.DashboardStatsResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.dto.response.PlacementResultResponse;
import com.campusconnect.dto.response.StudentProfileResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.PlacementResult;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.entity.RecruitmentDrive;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.mapper.StudentMapper;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.PlacementResultRepository;
import com.campusconnect.repository.RecruiterRepository;
import com.campusconnect.repository.RecruitmentDriveRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PlacementResultRepository placementResultRepository;
    private final RecruitmentDriveRepository driveRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;
    private final com.campusconnect.mapper.ApplicationMapper applicationMapper;

    public DashboardStatsResponse getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalRecruiters = recruiterRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalApplications = applicationRepository.count();
        long studentsPlaced = placementResultRepository.countByStatus("PLACED");
        long studentsNotPlaced = totalStudents - studentsPlaced;
        double placementPercentage = totalStudents > 0
                ? (double) studentsPlaced / totalStudents * 100 : 0.0;

        Map<String, Long> branchWiseStats = new HashMap<>();
        List<Student> allStudents = studentRepository.findAll();
        for (Student s : allStudents) {
            if (s.getBranch() != null) {
                branchWiseStats.merge(s.getBranch(), 1L, Long::sum);
            }
        }

        return DashboardStatsResponse.builder()
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalCompanies(totalCompanies)
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .totalApplications(totalApplications)
                .studentsPlaced(studentsPlaced)
                .studentsNotPlaced(studentsNotPlaced)
                .placementPercentage(placementPercentage)
                .branchWiseStats(branchWiseStats)
                .build();
    }

    public PagedResponse<StudentProfileResponse> getAllStudents(String search, Pageable pageable) {
        Page<Student> page = (search != null && !search.isBlank())
                ? studentRepository.searchStudents(search, pageable)
                : studentRepository.findAll(pageable);
        return PagedResponse.<StudentProfileResponse>builder()
                .content(page.getContent().stream().map(studentMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public StudentProfileResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return studentMapper.toResponse(student);
    }

    public PagedResponse<com.campusconnect.dto.response.RecruiterProfileResponse> getAllRecruiters(Pageable pageable) {
        Page<Recruiter> page = recruiterRepository.findAll(pageable);
        return PagedResponse.<com.campusconnect.dto.response.RecruiterProfileResponse>builder()
                .content(page.getContent().stream().map(this::toRecruiterResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional
    public void approveRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter", "id", recruiterId));
        recruiter.setApproved(true);
        recruiterRepository.save(recruiter);
    }

    public PagedResponse<com.campusconnect.dto.response.ApplicationResponse> getAllApplications(Pageable pageable) {
        Page<com.campusconnect.entity.Application> page = applicationRepository.findAll(pageable);
        return PagedResponse.<com.campusconnect.dto.response.ApplicationResponse>builder()
                .content(page.getContent().stream().map(applicationMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public PagedResponse<PlacementResultResponse> getPlacementResults(Pageable pageable) {
        Page<PlacementResult> page = placementResultRepository.findAll(pageable);
        return PagedResponse.<PlacementResultResponse>builder()
                .content(page.getContent().stream().map(this::toPlacementResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional
    public PlacementResultResponse createOrUpdatePlacementResult(Long studentId, Long jobId,
            String packageOffered, String joiningDateStr, String status) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        Company company = job.getCompany();

        PlacementResult result = placementResultRepository.findByStudent(student)
                .orElse(PlacementResult.builder().student(student).build());
        result.setCompany(company);
        result.setJob(job);
        result.setPackageOffered(packageOffered);
        if (joiningDateStr != null && !joiningDateStr.isBlank()) {
            result.setJoiningDate(LocalDate.parse(joiningDateStr));
        }
        result.setStatus(status != null ? status : "PLACED");
        result = placementResultRepository.save(result);
        return toPlacementResponse(result);
    }

    public List<StudentProfileResponse> exportStudentReport() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    public PagedResponse<com.campusconnect.dto.response.DashboardStatsResponse> getDrives(Pageable pageable) {
        // Return drives as raw – use drive response
        return null; // Handled in RecruitmentDriveService
    }

    @Transactional
    public RecruitmentDrive createDrive(CreateDriveRequest request) {
        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        }
        RecruitmentDrive drive = RecruitmentDrive.builder()
                .name(request.getName())
                .company(company)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "UPCOMING")
                .build();
        return driveRepository.save(drive);
    }

    @Transactional
    public RecruitmentDrive updateDriveStatus(Long driveId, String status) {
        RecruitmentDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive", "id", driveId));
        drive.setStatus(status);
        return driveRepository.save(drive);
    }

    private com.campusconnect.dto.response.RecruiterProfileResponse toRecruiterResponse(Recruiter r) {
        return com.campusconnect.dto.response.RecruiterProfileResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .email(r.getUser().getEmail())
                .fullName(r.getFullName())
                .designation(r.getDesignation())
                .phone(r.getPhone())
                .companyId(r.getCompany() != null ? r.getCompany().getId() : null)
                .companyName(r.getCompany() != null ? r.getCompany().getName() : null)
                .approved(r.getApproved())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
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
