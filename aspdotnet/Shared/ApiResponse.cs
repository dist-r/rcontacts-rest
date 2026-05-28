namespace AspDotNet.Shared;

public record ApiResponse<T>(
    string Message,
    bool Success,
    T Data
);