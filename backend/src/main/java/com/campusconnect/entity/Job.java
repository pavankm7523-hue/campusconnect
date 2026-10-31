package com.campusconnect.entity;

import com.campusconnect.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private Recruiter postedBy;

    @Column(name = "min_cgpa")
    private Double minCgpa;

    @Column(name = "eligible_branches", columnDefinition = "TEXT")
    private String eligibleBranches;

    @Column(name = "eligible_graduation_years", columnDefinition = "TEXT")
    private String eligibleGraduationYears;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "package_offered")
    private String packageOffered;

    @Column(name = "job_type")
    private String jobType;

    private String location;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    @Column(name = "total_positions")
    private Integer totalPositions;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
