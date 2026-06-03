package com.example.staylio_backend;

import com.example.staylio_backend.config.security.GeminiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(GeminiProperties.class)
public class StaylioBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(StaylioBackendApplication.class, args);
    }

}
