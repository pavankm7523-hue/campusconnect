package com.campusconnect.service;

import com.campusconnect.dto.request.CreateCompanyRequest;
import com.campusconnect.dto.response.CompanyResponse;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.mapper.CompanyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final com.campusconnect.repository.CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Transactional
    public CompanyResponse createCompany(CreateCompanyRequest request) {
        if (companyRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Company already exists with name: " + request.getName());
        }
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .build();
        company = companyRepository.save(company);
        return companyMapper.toResponse(company);
    }

    @Transactional
    public CompanyResponse updateCompany(Long id, CreateCompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        if (!company.getName().equals(request.getName()) && companyRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Company already exists with name: " + request.getName());
        }
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        if (request.getLogoUrl() != null) {
            company.setLogoUrl(request.getLogoUrl());
        }
        company = companyRepository.save(company);
        return companyMapper.toResponse(company);
    }

    public PagedResponse<CompanyResponse> getAllCompanies(Pageable pageable) {
        Page<Company> page = companyRepository.findAll(pageable);
        return PagedResponse.<CompanyResponse>builder()
                .content(page.getContent().stream().map(companyMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return companyMapper.toResponse(company);
    }

    @Transactional
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company", "id", id);
        }
        companyRepository.deleteById(id);
    }
}
