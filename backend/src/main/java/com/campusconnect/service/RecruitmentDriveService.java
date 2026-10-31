package com.campusconnect.service;

import com.campusconnect.dto.request.CreateDriveRequest;
import com.campusconnect.dto.response.PagedResponse;
import com.campusconnect.entity.Company;
import com.campusconnect.entity.RecruitmentDrive;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.CompanyRepository;
import com.campusconnect.repository.RecruitmentDriveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitmentDriveService {

    private final RecruitmentDriveRepository driveRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public RecruitmentDrive createDrive(CreateDriveRequest request) {
        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        }
        RecruitmentDrive drive = RecruitmentDrive.builder()
                .name(request.getName())
                .company(company)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "UPCOMING")
                .build();
        return driveRepository.save(drive);
    }

    @Transactional
    public RecruitmentDrive updateDrive(Long id, CreateDriveRequest request) {
        RecruitmentDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RecruitmentDrive", "id", id));
        drive.setName(request.getName());
        drive.setStartDate(request.getStartDate());
        drive.setEndDate(request.getEndDate());
        drive.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            drive.setStatus(request.getStatus());
        }
        if (request.getCompanyId() != null) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
            drive.setCompany(company);
        }
        return driveRepository.save(drive);
    }

    @Transactional
    public RecruitmentDrive updateStatus(Long id, String status) {
        RecruitmentDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RecruitmentDrive", "id", id));
        drive.setStatus(status);
        return driveRepository.save(drive);
    }

    @Transactional
    public void deleteDrive(Long id) {
        if (!driveRepository.existsById(id)) {
            throw new ResourceNotFoundException("RecruitmentDrive", "id", id);
        }
        driveRepository.deleteById(id);
    }

    public PagedResponse<RecruitmentDrive> getAllDrives(Pageable pageable) {
        Page<RecruitmentDrive> page = driveRepository.findAll(pageable);
        return PagedResponse.<RecruitmentDrive>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public RecruitmentDrive getDriveById(Long id) {
        return driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RecruitmentDrive", "id", id));
    }
}
