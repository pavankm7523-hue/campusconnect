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
public class CompanyResponse {
    private Long id;
    private String name;
    private String description;
    private String industry;
    private String website;
    private String logoUrl;
    private long recruiterCount;
    private long jobCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
