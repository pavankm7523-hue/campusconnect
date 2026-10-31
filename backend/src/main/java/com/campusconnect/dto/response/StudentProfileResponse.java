package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String rollNumber;
    private String branch;
    private Double cgpa;
    private Integer graduationYear;
    private String phone;
    private List<String> skills;
    private String resumeUrl;
    private Boolean profileComplete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
