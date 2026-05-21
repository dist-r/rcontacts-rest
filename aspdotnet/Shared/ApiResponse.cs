namespace AspDotNet.Shared;

public record ApiResponse<T>(
    string Message,
    T Data
);