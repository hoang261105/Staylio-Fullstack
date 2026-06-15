package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.service.ModerationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ModerationServiceImpl implements ModerationService {

    private final ChatClient chatClient;

    public ModerationServiceImpl(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public double getToxicityScore(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0.0;
        }

        // BƯỚC 1: LỌC TỪ KHÓA CỤC BỘ (BẮT TIẾNG LÓNG VIỆT NAM TRƯỚC)
        double localScore = getLocalBadwordScore(text);
        if (localScore >= 0.8) {
            log.info("Local badword filter triggered with score: {}", localScore);
            return localScore;
        }

        // BƯỚC 2: GỌI SANG GROQ (LLAMA 3) QUA SPRING AI
        try {
            String prompt = String.format(
                    "You are a strict toxicity analyzer. " +
                    "Analyze the following text and return ONLY a float number between 0.0 and 1.0 representing its toxicity score. " +
                    "0.0 means completely safe and polite. 1.0 means extremely toxic, hateful, or violent. " +
                    "Return NOTHING else except the number.\n\n" +
                    "Text: \"%s\"", text);

            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            log.info("Groq (Llama 3) raw response: {}", response);

            if (response != null && !response.trim().isEmpty()) {
                double aiScore = Double.parseDouble(response.trim());
                log.info("Groq AI Moderation Score: {}", aiScore);
                return aiScore;
            }

        } catch (Exception e) {
            log.error("Error calling Groq AI: {}", e.getMessage());
            return localScore;
        }

        return 0.0;
    }

    private double getLocalBadwordScore(String text) {
        String lowerText = text.toLowerCase();

        // Cấp 3: Cực kỳ độc hại -> Điểm > 0.8
        if (lowerText.contains("địt") || lowerText.contains("đm") || lowerText.contains("chó")
                || lowerText.contains("ngu") || lowerText.contains("lừa đảo") || lowerText.contains("cc")
                || lowerText.contains("lồn") || lowerText.contains("cặc") || lowerText.contains("đĩ")
                || lowerText.contains("cl") || lowerText.contains("óc chó")) {
            return 0.9;
        }

        // Cấp 2: Đáng ngờ (từ lóng, phàn nàn gắt gao, mỉa mai) -> 0.4 <= Điểm <= 0.8
        if (lowerText.contains("tệ hại") || lowerText.contains("tởm") || lowerText.contains("bẩn")
                || lowerText.contains("cút") || lowerText.contains("rác rưởi") || lowerText.contains("khuyết tật") 
                || lowerText.contains("khinh bỉ") || lowerText.contains("đần độn")) {
            return 0.6;
        }

        // Cấp 1: An toàn -> Điểm < 0.4
        return 0.1;
    }
}
