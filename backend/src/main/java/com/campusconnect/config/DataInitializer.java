package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.enums.ApplicationStatus;
import com.campusconnect.enums.JobStatus;
import com.campusconnect.enums.Role;
import com.campusconnect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data; skipping initial seed.");
            return;
        }

        log.info("Seeding initial data for CampusConnect...");
        String encodedPassword = passwordEncoder.encode("Admin@123");

        // 1. Admin
        User adminUser = User.builder()
                .email("admin@campusconnect.edu")
                .password(encodedPassword)
                .role(Role.ADMIN)
                .build();
        userRepository.save(adminUser);

        // 2. Companies
        Company tcs = Company.builder()
                .name("Tata Consultancy Services")
                .description("TCS is a global leader in IT services, consulting & business solutions.")
                .industry("Information Technology")
                .website("https://www.tcs.com")
                .build();
        companyRepository.save(tcs);

        Company infosys = Company.builder()
                .name("Infosys")
                .description("Infosys is a global leader in next-generation digital services and consulting.")
                .industry("Information Technology")
                .website("https://www.infosys.com")
                .build();
        companyRepository.save(infosys);

        Company wipro = Company.builder()
                .name("Wipro")
                .description("Wipro Limited is a leading technology services and consulting company.")
                .industry("Information Technology")
                .website("https://www.wipro.com")
                .build();
        companyRepository.save(wipro);

        // 3. Recruiters
        User rec1User = User.builder()
                .email("recruiter1@tcs.com")
                .password(encodedPassword)
                .role(Role.RECRUITER)
                .build();
        userRepository.save(rec1User);

        Recruiter recruiter1 = Recruiter.builder()
                .user(rec1User)
                .fullName("Rajesh Kumar")
                .designation("Talent Acquisition Manager")
                .phone("9876543210")
                .company(tcs)
                .approved(true)
                .build();
        recruiterRepository.save(recruiter1);

        User rec2User = User.builder()
                .email("recruiter2@infosys.com")
                .password(encodedPassword)
                .role(Role.RECRUITER)
                .build();
        userRepository.save(rec2User);

        Recruiter recruiter2 = Recruiter.builder()
                .user(rec2User)
                .fullName("Priya Sharma")
                .designation("Campus Hiring Lead")
                .phone("9876543211")
                .company(infosys)
                .approved(true)
                .build();
        recruiterRepository.save(recruiter2);

        // 4. Students
        User stu1User = User.builder()
                .email("student1@college.edu")
                .password(encodedPassword)
                .role(Role.STUDENT)
                .build();
        userRepository.save(stu1User);

        Student student1 = Student.builder()
                .user(stu1User)
                .fullName("Arjun Mehta")
                .rollNumber("CS2021001")
                .branch("CSE")
                .cgpa(8.5)
                .graduationYear(2025)
                .phone("9123456789")
                .skills("Java,Spring Boot,React,MySQL")
                .profileComplete(true)
                .build();
        studentRepository.save(student1);

        User stu2User = User.builder()
                .email("student2@college.edu")
                .password(encodedPassword)
                .role(Role.STUDENT)
                .build();
        userRepository.save(stu2User);

        Student student2 = Student.builder()
                .user(stu2User)
                .fullName("Priya Nair")
                .rollNumber("CS2021002")
                .branch("IT")
                .cgpa(7.8)
                .graduationYear(2025)
                .phone("9123456790")
                .skills("Python,Django,React,PostgreSQL")
                .profileComplete(true)
                .build();
        studentRepository.save(student2);

        // 5. Jobs
        Job job1 = Job.builder()
                .title("Software Development Engineer")
                .description("We are looking for passionate software engineers to develop modern enterprise systems using Java and Spring Boot.")
                .company(tcs)
                .postedBy(recruiter1)
                .minCgpa(7.0)
                .eligibleBranches("CSE,IT,ECE")
                .eligibleGraduationYears("2025,2026")
                .requiredSkills("Java,Spring Boot,MySQL")
                .packageOffered("8-10 LPA")
                .jobType("FULL_TIME")
                .location("Bangalore / Hyderabad / Chennai")
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(JobStatus.OPEN)
                .totalPositions(25)
                .build();
        jobRepository.save(job1);

        Job job2 = Job.builder()
                .title("Systems Engineer")
                .description("Digital transformation and cloud systems engineering across multi-platform client environments.")
                .company(infosys)
                .postedBy(recruiter2)
                .minCgpa(6.5)
                .eligibleBranches("CSE,IT,ECE,EEE,ME")
                .eligibleGraduationYears("2025")
                .requiredSkills("Java,Python,SQL")
                .packageOffered("6.5-8 LPA")
                .jobType("FULL_TIME")
                .location("Pune / Bangalore / Mysore")
                .applicationDeadline(LocalDate.now().plusDays(20))
                .status(JobStatus.OPEN)
                .totalPositions(50)
                .build();
        jobRepository.save(job2);

        // 6. Application
        Application app1 = Application.builder()
                .job(job1)
                .student(student1)
                .status(ApplicationStatus.APPLIED)
                .build();
        applicationRepository.save(app1);

        // 7. Notifications
        Notification notif1 = Notification.builder()
                .user(stu1User)
                .title("Welcome to CampusConnect!")
                .message("Your profile is verified. Check out open placement drives!")
                .type("INFO")
                .read(false)
                .build();
        notificationRepository.save(notif1);

        Notification notif2 = Notification.builder()
                .user(stu1User)
                .title("New Job Opening: Software Development Engineer")
                .message("TCS has posted a new opening. Check your eligibility!")
                .type("JOB")
                .read(false)
                .build();
        notificationRepository.save(notif2);

        log.info("CampusConnect seed data initialization completed successfully.");
    }
}
