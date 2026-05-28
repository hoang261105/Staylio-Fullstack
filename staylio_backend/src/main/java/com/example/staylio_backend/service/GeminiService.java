package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.GeminiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {
    private final GeminiProperties geminiProperties;
    private final RestTemplate restTemplate;

    public String ask(String message) {
        String url = geminiProperties.getBaseUrl()
                + "/"
                + geminiProperties.getModel()
                + ":generateContent?key="
                + geminiProperties.getApiKey();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> text = Map.of(
                "text", message
        );

        Map<String, Object> part = Map.of(
                "parts", List.of(text)
        );

        Map<String, Object> body = Map.of(
                "contents", List.of(part)
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                url,
                request,
                Map.class
        );

        Map<String, Object> responseBody = response.getBody();

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) responseBody.get("candidates");

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        return parts.get(0).get("text").toString();
    }
}
