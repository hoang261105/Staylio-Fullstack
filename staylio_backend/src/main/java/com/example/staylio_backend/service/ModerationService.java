package com.example.staylio_backend.service;

public interface ModerationService {
    double getToxicityScore(String text);
}
