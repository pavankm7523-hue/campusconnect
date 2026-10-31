package com.campusconnect;

import com.campusconnect.dto.response.ApplicationResponse;
import com.campusconnect.entity.Application;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.mapper.ApplicationMapper;
import com.campusconnect.repository.ApplicationRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.ApplicationService;
import com.campusconnect.service.EligibilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EligibilityService eligibilityService;

    @Mock
    private ApplicationMapper applicationMapper;

    @InjectMocks
    private ApplicationService applicationService;

    private User user;
    private Student student;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("student@college.edu").build();
        student = Student.builder().id(2L).user(user).fullName("Jane Doe").cgpa(8.2).build();
        job = Job.builder().id(10L).title("Backend Engineer").status(JobStatus.OPEN).build();
        application = Application.builder().id(100L).job(job).student(student).status(ApplicationStatus.APPLIED).build();
    }

    @Test
    @DisplayName("Should successfully submit application when eligible and not previously applied")
    void testApplyForJob_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser(user)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobAndStudent(job, student)).thenReturn(false);
        when(eligibilityService.isEligible(2L, 10L)).thenReturn(true);
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        when(applicationMapper.toResponse(any(Application.class))).thenReturn(
                ApplicationResponse.builder().id(100L).status(ApplicationStatus.APPLIED).jobTitle("Backend Engineer").build()
        );

        ApplicationResponse response = applicationService.applyForJob(1L, 10L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when student already applied for job")
    void testApplyForJob_AlreadyApplied_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser(user)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobAndStudent(job, student)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> applicationService.applyForJob(1L, 10L));
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when student does not satisfy job eligibility")
    void testApplyForJob_NotEligible_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser(user)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobAndStudent(job, student)).thenReturn(false);
        when(eligibilityService.isEligible(2L, 10L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyForJob(1L, 10L));
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when job is closed or draft")
    void testApplyForJob_JobNotOpen_ThrowsException() {
        job.setStatus(JobStatus.CLOSED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser(user)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyForJob(1L, 10L));
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should successfully withdraw application in APPLIED status")
    void testWithdrawApplication_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser(user)).thenReturn(Optional.of(student));
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));

        assertDoesNotThrow(() -> applicationService.withdrawApplication(1L, 100L));
        verify(applicationRepository, times(1)).delete(application);
    }
}
