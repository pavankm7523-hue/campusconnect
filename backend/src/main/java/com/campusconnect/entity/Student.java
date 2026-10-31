package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "roll_number", unique = true)
    private String rollNumber;

    private String branch;

    private Double cgpa;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "profile_complete")
    @Builder.Default
    private Boolean profileComplete = false;

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
