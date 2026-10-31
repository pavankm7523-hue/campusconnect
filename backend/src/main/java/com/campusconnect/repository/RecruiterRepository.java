package com.campusconnect.repository;

import com.campusconnect.entity.Company;
import com.campusconnect.entity.Recruiter;
import com.campusconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByUser(User user);
    List<Recruiter> findByCompany(Company company);
    long countByCompany(Company company);
}
