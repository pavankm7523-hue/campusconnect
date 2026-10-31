package com.campusconnect.dto.request;

import com.campusconnect.enums.ApplicationStatus;
import lombok.Data;

@Data
public class ApplicationStatusRequest {
    private ApplicationStatus status;
    private String notes;
}
