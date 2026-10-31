package com.campusconnect;

import com.campusconnect.dto.response.EligibilityResponse;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.StudentRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EligibilityServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private EligibilityService eligibilityService;

    private Student student;
    private Job job;

    @BeforeEach
    void setUp() {
        student = Student.builder()
                .id(1L)
                .fullName("Alex Rivers")
                .cgpa(8.5)
                .branch("CSE")
                .graduationYear(2025)
                .skills("Java,Spring Boot,MySQL,React")
                .build();

        job = Job.builder()
                .id(10L)
                .title("Software Development Engineer")
                .minCgpa(7.5)
                .eligibleBranches("CSE,IT,ECE")
                .eligibleGraduationYears("2025,2026")
                .requiredSkills("Java,Spring Boot")
                .build();
    }

    @Test
    @DisplayName("Should return eligible when student meets all criteria")
    void testEligible_AllCriteriaMet() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        EligibilityResponse response = eligibilityService.checkEligibility(1L, 10L);

        assertNotNull(response);
        assertTrue(response.isEligible());
        assertTrue(response.getFailedCriteria().isEmpty());
        assertEquals(4, response.getSatisfiedCriteria().size());
    }

    @Test
    @DisplayName("Should return ineligible when student CGPA is lower than required")
    void testIneligible_LowCgpa() {
        student.setCgpa(6.8); // Min is 7.5
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        EligibilityResponse response = eligibilityService.checkEligibility(1L, 10L);

        assertNotNull(response);
        assertFalse(response.isEligible());
        assertFalse(response.getFailedCriteria().isEmpty());
        assertTrue(response.getFailedCriteria().get(0).contains("CGPA"));
    }

    @Test
    @DisplayName("Should return ineligible when student branch is not in eligible branches list")
    void testIneligible_WrongBranch() {
        student.setBranch("Civil Engineering");
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        EligibilityResponse response = eligibilityService.checkEligibility(1L, 10L);

        assertNotNull(response);
        assertFalse(response.isEligible());
        assertTrue(response.getFailedCriteria().stream().anyMatch(c -> c.contains("Branch")));
    }

    @Test
    @DisplayName("Should return ineligible when student graduation year is not in eligible batch list")
    void testIneligible_WrongGraduationYear() {
        student.setGraduationYear(2024); // Job accepts 2025, 2026
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        EligibilityResponse response = eligibilityService.checkEligibility(1L, 10L);

        assertNotNull(response);
        assertFalse(response.isEligible());
        assertTrue(response.getFailedCriteria().stream().anyMatch(c -> c.contains("Graduation year")));
    }

    @Test
    @DisplayName("Should return ineligible when student lacks required skills")
    void testIneligible_MissingSkills() {
        student.setSkills("Python,Django"); // Job requires Java, Spring Boot
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        EligibilityResponse response = eligibilityService.checkEligibility(1L, 10L);

        assertNotNull(response);
        assertFalse(response.isEligible());
        assertTrue(response.getFailedCriteria().stream().anyMatch(c -> c.contains("Missing required skills")));
    }
}
