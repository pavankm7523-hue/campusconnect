package com.campusconnect.dto.request;

import lombok.Data;

@Data
public class CreateNotificationRequest {
    private Long userId;
    private String title;
    private String message;
    private String type;
}
