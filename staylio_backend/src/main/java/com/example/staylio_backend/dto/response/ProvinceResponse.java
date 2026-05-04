package com.example.staylio_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProvinceResponse {
    private Long id;
    private String provinceName;
    private String imageURL;
}
