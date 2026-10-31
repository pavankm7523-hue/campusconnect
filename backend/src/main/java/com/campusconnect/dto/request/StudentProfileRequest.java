package com.campusconnect.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class StudentProfileRequest {
    private String fullName;
    private String rollNumber;
    private String branch;
    private Double cgpa;
    private Integer graduationYear;
    private String phone;
    private List<String> skills;
}
