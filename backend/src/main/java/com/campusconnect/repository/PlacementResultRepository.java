package com.campusconnect.repository;

import com.campusconnect.entity.Company;
import com.campusconnect.entity.PlacementResult;
import com.campusconnect.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementResultRepository extends JpaRepository<PlacementResult, Long> {
    Optional<PlacementResult> findByStudent(Student student);
    long countByStatus(String status);
    List<PlacementResult> findByCompany(Company company);
}
