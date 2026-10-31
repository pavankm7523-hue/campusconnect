package com.campusconnect.mapper;

import com.campusconnect.dto.response.ApplicationResponse;
import com.campusconnect.entity.Application;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationResponse toResponse(Application application) {
        if (application == null) return null;
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob() != null ? application.getJob().getId() : null)
                .jobTitle(application.getJob() != null ? application.getJob().getTitle() : null)
                .companyName(application.getJob() != null && application.getJob().getCompany() != null
                        ? application.getJob().getCompany().getName() : null)
                .studentId(application.getStudent() != null ? application.getStudent().getId() : null)
                .studentName(application.getStudent() != null ? application.getStudent().getFullName() : null)
                .studentEmail(application.getStudent() != null && application.getStudent().getUser() != null
                        ? application.getStudent().getUser().getEmail() : null)
                .rollNumber(application.getStudent() != null ? application.getStudent().getRollNumber() : null)
                .cgpa(application.getStudent() != null ? application.getStudent().getCgpa() : null)
                .branch(application.getStudent() != null ? application.getStudent().getBranch() : null)
                .resumeUrl(application.getStudent() != null ? application.getStudent().getResumeUrl() : null)
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .notes(application.getNotes())
                .build();
    }
}
