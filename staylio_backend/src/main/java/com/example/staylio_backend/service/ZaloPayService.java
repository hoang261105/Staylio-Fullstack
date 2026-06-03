package com.example.staylio_backend.service;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.ZaloPayProperties;
import com.example.staylio_backend.dto.response.ZaloPayCreateOrderResponse;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ZaloPayService {

    private final ZaloPayProperties properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ZaloPayCreateOrderResponse createOrder(
            Booking booking,
            Payment payment
    ) {
        try {
            long appTime = System.currentTimeMillis();

            String appTransId = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyMMdd"))
                    + "_"
                    + booking.getBookingCode();

            String appUser = booking.getUser().getEmail();

            String embedData = objectMapper.writeValueAsString(
                    Map.of(
                            "redirecturl", properties.getRedirectUrl(),
                            "bookingId", booking.getId(),
                            "paymentId", payment.getId()
                    )
            );

            String item = objectMapper.writeValueAsString(
                    List.of(
                            Map.of(
                                    "itemid", booking.getRoom().getId(),
                                    "itemname", booking.getRoom().getRoomName(),
                                    "itemprice", payment.getAmount().longValue(),
                                    "itemquantity", 1
                            )
                    )
            );

            long amount = payment.getAmount().longValue();

            String description =
                    "Staylio - Thanh toán booking " + booking.getBookingCode();

            String macInput = properties.getAppId()
                    + "|"
                    + appTransId
                    + "|"
                    + appUser
                    + "|"
                    + amount
                    + "|"
                    + appTime
                    + "|"
                    + embedData
                    + "|"
                    + item;

            String mac = hmacSha256(macInput, properties.getKey1());

            Map<String, Object> body = new HashMap<>();
            body.put("app_id", properties.getAppId());
            body.put("app_user", appUser);
            body.put("app_time", appTime);
            body.put("amount", amount);
            body.put("app_trans_id", appTransId);
            body.put("embed_data", embedData);
            body.put("item", item);
            body.put("description", description);
            body.put("bank_code", "zalopayapp");
            body.put("callback_url", properties.getCallbackUrl());
            body.put("mac", mac);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    properties.getCreateOrderUrl(),
                    body,
                    Map.class
            );

            Map responseBody = response.getBody();

            String rawResponse = objectMapper.writeValueAsString(responseBody);

            String paymentUrl = responseBody.get("order_url") != null
                    ? responseBody.get("order_url").toString()
                    : null;

            if (paymentUrl == null && responseBody.get("orderurl") != null) {
                paymentUrl = responseBody.get("orderurl").toString();
            }

            return ZaloPayCreateOrderResponse.builder()
                    .appTransId(appTransId)
                    .paymentUrl(paymentUrl)
                    .rawResponse(rawResponse)
                    .build();

        } catch (Exception e) {
            throw new AppException(ErrorCode.ZALOPAY_CREATE_ORDER_FAILED);
        }
    }

    public String hmacSha256(String data, String key) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            hmac.init(secretKey);

            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }

            return hash.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}