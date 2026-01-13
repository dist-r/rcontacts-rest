package org.distr.rcontacts.exception;

public class AppException extends RuntimeException {
    
    private final String message;
    private final int code;

    public AppException(String message, int code) {
        super(message);
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }
}