namespace AspDotNet.Shared;

using Microsoft.AspNetCore.Mvc;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            _logger.LogError(ex, "Business exception occurred");

            await WriteJsonResponse(
                context,
                ex.Code,
                ex.Message
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");

            await WriteJsonResponse(
                context,
                StatusCodes.Status500InternalServerError,
                "Internal server error"
            );
        }
    }

    private static Task WriteJsonResponse(
        HttpContext context,
        int statusCode,
        string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new ApiResponse<object?>(
            message,
            false,
            null
        );

        return context.Response.WriteAsJsonAsync(response);
    }
}