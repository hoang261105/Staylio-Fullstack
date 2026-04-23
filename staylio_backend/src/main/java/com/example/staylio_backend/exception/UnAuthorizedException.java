package com.example.staylio_backend.exception;

public class UnAuthorizedException extends RuntimeException
{
    public UnAuthorizedException(String message)
    {
        super(message);
    }
}
