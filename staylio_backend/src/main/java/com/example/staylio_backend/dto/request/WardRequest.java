package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.common.utils.StringListDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.util.List;

@Data
public class WardRequest {
    private String name;

    @JsonDeserialize(using = StringListDeserializer.class)
    private List<String> mergedFrom;
}
