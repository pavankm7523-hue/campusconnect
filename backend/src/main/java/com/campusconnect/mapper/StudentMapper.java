package com.campusconnect.mapper;

import com.campusconnect.dto.response.StudentProfileResponse;
import com.campusconnect.entity.Student;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class StudentMapper {

    public StudentProfileResponse toResponse(Student student) {
        if (student == null) return null;
        return StudentProfileResponse.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .email(student.getUser() != null ? student.getUser().getEmail() : null)
                .fullName(student.getFullName())
                .rollNumber(student.getRollNumber())
                .branch(student.getBranch())
                .cgpa(student.getCgpa())
                .graduationYear(student.getGraduationYear())
                .phone(student.getPhone())
                .skills(parseCommaSeparated(student.getSkills()))
                .resumeUrl(student.getResumeUrl())
                .profileComplete(student.getProfileComplete())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public List<String> parseCommaSeparated(String value) {
        if (value == null || value.isBlank()) return Collections.emptyList();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public String toCommaSeparated(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return String.join(",", list);
    }
}
