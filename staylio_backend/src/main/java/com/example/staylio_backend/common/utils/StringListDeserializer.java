package com.example.staylio_backend.common.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class StringListDeserializer extends JsonDeserializer<List<String>> {

    @Override
    public List<String> deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        JsonNode node = p.getCodec().readTree(p);
        List<String> list = new ArrayList<>();

        if (node.isArray()) {
            // Nếu là mảng -> duyệt từng phần tử
            for (JsonNode element : node) {
                list.add(element.asText());
            }
        } else if (node.isTextual()) {
            // Nếu là chuỗi -> thêm 1 phần tử
            list.add(node.asText());
        }

        return list;
    }
}
