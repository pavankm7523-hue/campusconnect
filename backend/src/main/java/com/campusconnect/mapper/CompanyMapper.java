package com.campusconnect.mapper;

import com.campusconnect.dto.response.CompanyResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;

    public CompanyResponse toResponse(Company company) {
        if (company == null) return null;
        long recruiterCount = recruiterRepository.countByCompany(company);
        long jobCount = jobRepository.countByCompany(company);
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .logoUrl(company.getLogoUrl())
                .recruiterCount(recruiterCount)
                .jobCount(jobCount)
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
