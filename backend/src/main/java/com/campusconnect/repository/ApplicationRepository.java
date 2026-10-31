package com.campusconnect.repository;

import com.campusconnect.entity.Application;
import com.campusconnect.entity.Job;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByStudent(Student student, Pageable pageable);
    List<Application> findByStudent(Student student);
    Page<Application> findByJob(Job job, Pageable pageable);
    List<Application> findByJob(Job job);
    Optional<Application> findByStudentAndJob(Student student, Job job);
    boolean existsByJobAndStudent(Job job, Student student);
    long countByStatus(ApplicationStatus status);
    List<Application> findByStudentAndStatus(Student student, ApplicationStatus status);
    Page<Application> findByStudentAndStatus(Student student, ApplicationStatus status, Pageable pageable);
}
