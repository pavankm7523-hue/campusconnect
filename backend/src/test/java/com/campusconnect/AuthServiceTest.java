package com.campusconnect;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterStudentRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.Role;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.RecruiterRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtUtil;
import com.campusconnect.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RecruiterRepository recruiterRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterStudentRequest registerRequest;
    private User studentUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterStudentRequest();
        registerRequest.setEmail("student@college.edu");
        registerRequest.setPassword("Secret@123");
        registerRequest.setFullName("John Doe");
        registerRequest.setRollNumber("CS2025001");
        registerRequest.setBranch("CSE");
        registerRequest.setGraduationYear(2025);
        registerRequest.setPhone("9876543210");

        studentUser = User.builder()
                .id(1L)
                .email("student@college.edu")
                .password("encoded_password")
                .role(Role.STUDENT)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a student")
    void testRegisterStudent_Success() {
        when(userRepository.existsByEmail("student@college.edu")).thenReturn(false);
        when(studentRepository.existsByRollNumber("CS2025001")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);
        when(studentRepository.save(any(Student.class))).thenReturn(new Student());
        when(jwtUtil.generateToken(any(User.class))).thenReturn("mock_jwt_token");

        AuthResponse response = authService.registerStudent(registerRequest);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("STUDENT", response.getRole());
        assertEquals("student@college.edu", response.getEmail());

        verify(userRepository, times(1)).save(any(User.class));
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void testRegisterStudent_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("student@college.edu")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.registerStudent(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when roll number already exists")
    void testRegisterStudent_DuplicateRollNumber_ThrowsException() {
        when(userRepository.existsByEmail("student@college.edu")).thenReturn(false);
        when(studentRepository.existsByRollNumber("CS2025001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.registerStudent(registerRequest));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should successfully authenticate and return token for valid login")
    void testLogin_ValidCredentials_ReturnsToken() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("student@college.edu");
        loginRequest.setPassword("Secret@123");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(studentUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("student@college.edu")).thenReturn(Optional.of(studentUser));
        when(jwtUtil.generateToken(studentUser)).thenReturn("valid_jwt_token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("valid_jwt_token", response.getToken());
        assertEquals("STUDENT", response.getRole());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when password is wrong")
    void testLogin_InvalidCredentials_ThrowsException() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("student@college.edu");
        loginRequest.setPassword("WrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
