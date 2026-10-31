package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponse {
    private Boolean profileComplete;
    private long eligibleJobCount;
    private long totalApplications;
    private long shortlistedCount;
    private long upcomingInterviews;
    private List<NotificationResponse> recentNotifications;
}
