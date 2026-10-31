package com.campusconnect.repository;

import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);

    @Query("SELECT s FROM Student s WHERE s.branch = :branch")
    Page<Student> findByBranch(@Param("branch") String branch, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.cgpa >= :minCgpa")
    Page<Student> findByCgpaGreaterThanEqual(@Param("minCgpa") Double minCgpa, Pageable pageable);

    @Query("SELECT s FROM Student s JOIN s.user u WHERE " +
            "(:search IS NULL OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("search") String search, Pageable pageable);
}
