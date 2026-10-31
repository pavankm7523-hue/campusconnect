package com.campusconnect.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateDriveRequest {
    private String name;
    private Long companyId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String status;
}
