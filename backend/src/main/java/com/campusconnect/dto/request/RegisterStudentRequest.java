package com.campusconnect.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterStudentRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    private String phone;
}
