package com.campusconnect.repository;

import com.campusconnect.entity.Company;
import com.campusconnect.entity.RecruitmentDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecruitmentDriveRepository extends JpaRepository<RecruitmentDrive, Long> {
    List<RecruitmentDrive> findByCompany(Company company);
    Page<RecruitmentDrive> findByStatus(String status, Pageable pageable);
}
