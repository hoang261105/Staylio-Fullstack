package com.example.staylio_backend.service;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.payment.PayPalProperties;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayPalService {

    private final PayPalProperties properties;
    private final RestTemplate restTemplate;

    private String getAccessToken() {
        String url = properties.getBaseUrl() + "/v1/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(properties.getClientId(), properties.getClientSecret());
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            log.error("Error getting PayPal access token", e);
            throw new AppException(ErrorCode.PAYPAL_GET_TOKEN_FAILED);
        }
    }

    public Map<String, Object> createOrder(Booking booking, Payment payment) {
        String url = properties.getBaseUrl() + "/v2/checkout/orders";
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Convert VND to USD (assuming rate 25,000 VND = 1 USD for demonstration)
        BigDecimal usdAmount = payment.getAmount().divide(new BigDecimal("25000"), 2, RoundingMode.HALF_UP);

        Map<String, Object> amountMap = new HashMap<>();
        amountMap.put("currency_code", "USD");
        amountMap.put("value", usdAmount.toString());

        Map<String, Object> purchaseUnit = new HashMap<>();
        purchaseUnit.put("reference_id", booking.getBookingCode());
        purchaseUnit.put("amount", amountMap);

        Map<String, Object> applicationContext = new HashMap<>();
        applicationContext.put("return_url", properties.getReturnUrl() + "?bookingId=" + booking.getId());
        applicationContext.put("cancel_url", properties.getCancelUrl() + "?bookingId=" + booking.getId());
        applicationContext.put("user_action", "PAY_NOW");

        Map<String, Object> body = new HashMap<>();
        body.put("intent", "CAPTURE");
        body.put("purchase_units", Collections.singletonList(purchaseUnit));
        body.put("application_context", applicationContext);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error creating PayPal order", e);
            throw new AppException(ErrorCode.PAYPAL_CREATE_ORDER_FAILED);
        }
    }

    public Map<String, Object> captureOrder(String orderId) {
        String url = properties.getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture";
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(null, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error capturing PayPal order", e);
            throw new AppException(ErrorCode.PAYPAL_CAPTURE_FAILED);
        }
    }
}
