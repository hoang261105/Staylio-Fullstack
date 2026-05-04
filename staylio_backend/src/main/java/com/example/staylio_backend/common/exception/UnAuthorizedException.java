package com.example.staylio_backend.common.exception;

public class UnAuthorizedException extends RuntimeException
{
    public UnAuthorizedException(String message)
    {
        super(message);
    }
}
