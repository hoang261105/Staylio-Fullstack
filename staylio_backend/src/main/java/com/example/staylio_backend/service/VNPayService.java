package com.example.staylio_backend.service;

import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;

public interface VNPayService {
    String createOrder(Booking booking, Payment payment);
}
