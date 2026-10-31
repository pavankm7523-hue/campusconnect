package com.campusconnect.repository;

import com.campusconnect.entity.Application;
import com.campusconnect.entity.Interview;
import com.campusconnect.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByApplication(Application application);

    @Query("SELECT i FROM Interview i WHERE i.application.job.id = :jobId")
    List<Interview> findByApplicationJob(@Param("jobId") Long jobId);

    @Query("SELECT i FROM Interview i WHERE i.application.student = :student")
    List<Interview> findByApplicationStudent(@Param("student") Student student);

    List<Interview> findByApplicationIn(List<Application> applications);
}
