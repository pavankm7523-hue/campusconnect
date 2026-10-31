package com.campusconnect.controller;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterRecruiterRequest;
import com.campusconnect.dto.request.RegisterStudentRequest;
import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    @Operation(summary = "Register a new student")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(
            @Valid @RequestBody RegisterStudentRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student registered successfully", response));
    }

    @PostMapping("/register/recruiter")
    @Operation(summary = "Register a new recruiter")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRecruiter(
            @Valid @RequestBody RegisterRecruiterRequest request) {
        AuthResponse response = authService.registerRecruiter(request);
        return ResponseEntity.ok(ApiResponse.success("Recruiter registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (client-side token invalidation)")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
