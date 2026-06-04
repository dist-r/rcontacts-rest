package org.distr.rcontacts.exception;

import java.util.List;

import org.distr.rcontacts.app.ApiResponse;
// import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
// import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalException {

    // private static final Logger logger = LoggerFactory.getLogger(GlobalException.class);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
  
        ApiResponse<Object> response = new ApiResponse<>(ex.getMessage(), false, null);
        return ResponseEntity.status(ex.getCode()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .toList();

        return ResponseEntity
                .status(400)
                .body(new ApiResponse<>("Validation error", false, errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
        
        String message = "Internal Server Error";
        ApiResponse<Object> response = new ApiResponse<>(message, false, null);
        return ResponseEntity.status(500).body(response);

    }
    
}
