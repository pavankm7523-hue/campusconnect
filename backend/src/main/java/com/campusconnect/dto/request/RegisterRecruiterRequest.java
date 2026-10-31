package com.campusconnect.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRecruiterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String designation;
    private String phone;
    private Long companyId;
    private String companyName;
    private String companyDescription;
    private String companyIndustry;
    private String companyWebsite;
}
