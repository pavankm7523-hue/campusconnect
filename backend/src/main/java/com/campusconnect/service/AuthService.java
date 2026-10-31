package com.campusconnect.service;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterRecruiterRequest;
import com.campusconnect.dto.request.RegisterStudentRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.Role;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.RecruiterRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already registered: " + request.getRollNumber());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .fullName(request.getFullName())
                .rollNumber(request.getRollNumber())
                .branch(request.getBranch())
                .graduationYear(request.getGraduationYear())
                .phone(request.getPhone())
                .profileComplete(false)
                .build();
        studentRepository.save(student);

        String token = jwtUtil.generateToken(user);
        log.info("Student registered successfully: {}", user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .email(user.getEmail())
                .message("Student registered successfully")
                .build();
    }

    @Transactional
    public AuthResponse registerRecruiter(RegisterRecruiterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        Company company;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        } else if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            if (companyRepository.existsByName(request.getCompanyName())) {
                company = companyRepository.findByName(request.getCompanyName()).orElseThrow();
            } else {
                company = Company.builder()
                        .name(request.getCompanyName())
                        .description(request.getCompanyDescription())
                        .industry(request.getCompanyIndustry())
                        .website(request.getCompanyWebsite())
                        .build();
                company = companyRepository.save(company);
            }
        } else {
            throw new IllegalArgumentException("Either companyId or companyName must be provided");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.RECRUITER)
                .build();
        user = userRepository.save(user);

        Recruiter recruiter = Recruiter.builder()
                .user(user)
                .fullName(request.getFullName())
                .designation(request.getDesignation())
                .phone(request.getPhone())
                .company(company)
                .approved(false)
                .build();
        recruiterRepository.save(recruiter);

        String token = jwtUtil.generateToken(user);
        log.info("Recruiter registered successfully: {}", user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .email(user.getEmail())
                .message("Recruiter registered successfully. Awaiting admin approval.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
            String token = jwtUtil.generateToken(userDetails);
            log.info("User logged in: {}", user.getEmail());
            return AuthResponse.builder()
                    .token(token)
                    .role(user.getRole().name())
                    .userId(user.getId())
                    .email(user.getEmail())
                    .message("Login successful")
                    .build();
        } catch (BadCredentialsException e) {
            throw new com.campusconnect.exception.UnauthorizedException("Invalid email or password");
        }
    }
}
