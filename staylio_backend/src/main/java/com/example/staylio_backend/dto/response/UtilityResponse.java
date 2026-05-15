package com.example.staylio_backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityResponse {
    private Long id;
    private String title;
    private String iconName;
    private String description;
    private Boolean isDeleted;
}
