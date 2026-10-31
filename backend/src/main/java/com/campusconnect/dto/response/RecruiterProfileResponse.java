package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String designation;
    private String phone;
    private Long companyId;
    private String companyName;
    private Boolean approved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
