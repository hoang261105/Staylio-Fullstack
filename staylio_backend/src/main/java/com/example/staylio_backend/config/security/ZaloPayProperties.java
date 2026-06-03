package com.example.staylio_backend.config.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "zalopay")
public class ZaloPayProperties {
    private Integer appId;
    private String key1;
    private String key2;
    private String createOrderUrl;
    private String callbackUrl;
    private String redirectUrl;
}