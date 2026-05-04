package com.example.staylio_backend.common.exception;

import com.example.staylio_backend.common.constants.ErrorCode;

public class AppException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String field;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.field = null;
    }

    public AppException(ErrorCode errorCode, String field) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.field = field;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getField() {
        return field;
    }
}