package com.campusconnect.repository;

import com.campusconnect.entity.Company;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByCompany(Company company, Pageable pageable);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByCompanyAndStatus(Company company, JobStatus status, Pageable pageable);

    List<Job> findByPostedBy(Recruiter recruiter);

    Page<Job> findByPostedBy(Recruiter recruiter, Pageable pageable);

    long countByStatus(JobStatus status);

    long countByCompany(Company company);

    @Query("SELECT j FROM Job j WHERE " +
            "(:status IS NULL OR j.status = :status) AND " +
            "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> searchJobs(@Param("status") JobStatus status,
                          @Param("search") String search,
                          Pageable pageable);
}
