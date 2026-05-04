package com.example.staylio_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProvinceRequest {
    private String id;
    private String province;
    private List<String> licensePlates;
    private List<WardRequest> wards;
}
