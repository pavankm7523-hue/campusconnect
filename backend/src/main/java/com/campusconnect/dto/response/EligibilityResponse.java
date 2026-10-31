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
public class EligibilityResponse {
    private Long jobId;
    private boolean eligible;
    private List<String> satisfiedCriteria;
    private List<String> failedCriteria;
}
