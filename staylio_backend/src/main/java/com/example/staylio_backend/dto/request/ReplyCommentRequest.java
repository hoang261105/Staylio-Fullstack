package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyCommentRequest {
    @NotBlank(message = "Vui lòng nhập phản hồi!")
    private String replyComment;
}
