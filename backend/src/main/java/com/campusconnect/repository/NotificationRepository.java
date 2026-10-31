package com.campusconnect.repository;

import com.campusconnect.entity.Notification;
import com.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    long countByUserAndReadFalse(User user);
    List<Notification> findByUserAndReadFalse(User user);
}
