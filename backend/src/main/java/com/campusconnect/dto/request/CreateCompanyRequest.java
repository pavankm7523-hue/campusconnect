package com.campusconnect.dto.request;

import lombok.Data;

@Data
public class CreateCompanyRequest {
    private String name;
    private String description;
    private String industry;
    private String website;
    private String logoUrl;
}
