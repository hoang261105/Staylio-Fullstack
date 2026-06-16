package com.example.staylio_backend.service.impl.admin.helper;

import com.example.staylio_backend.dto.response.ZaloPayCreateOrderResponse;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.service.PayPalService;
import com.example.staylio_backend.service.VNPayService;
import com.example.staylio_backend.service.ZaloPayService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingPaymentDispatcher {

    private final ZaloPayService zaloPayService;
    private final PayPalService payPalService;
    private final VNPayService vnPayService;
    private final PaymentRepo paymentRepo;

    @SuppressWarnings("unchecked")
    public void dispatchPayment(Booking booking, Payment payment, PaymentMethod method) {
        if (method == PaymentMethod.ZALOPAY) {
            ZaloPayCreateOrderResponse zaloPayResponse = zaloPayService.createOrder(booking, payment);

            payment.setGatewayOrderId(zaloPayResponse.getAppTransId());
            payment.setPaymentUrl(zaloPayResponse.getPaymentUrl());
            payment.setRawResponse(zaloPayResponse.getRawResponse());

            paymentRepo.save(payment);
        } else if (method == PaymentMethod.PAYPAL) {
            Map<String, Object> payPalResponse = payPalService.createOrder(booking, payment);

            String orderId = (String) payPalResponse.get("id");
            String approveUrl = null;

            List<Map<String, String>> links = (List<Map<String, String>>) payPalResponse.get("links");
            if (links != null) {
                for (Map<String, String> link : links) {
                    if ("approve".equals(link.get("rel"))) {
                        approveUrl = link.get("href");
                        break;
                    }
                }
            }

            payment.setGatewayOrderId(orderId);
            payment.setPaymentUrl(approveUrl);

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                payment.setRawResponse(objectMapper.writeValueAsString(payPalResponse));
            } catch (Exception e) {
                // ignore
            }

            paymentRepo.save(payment);
        } else if (method == PaymentMethod.VNPAY) {
            String vnPayUrl = vnPayService.createOrder(booking, payment);
            payment.setPaymentUrl(vnPayUrl);
            paymentRepo.save(payment);
        }
    }
}
