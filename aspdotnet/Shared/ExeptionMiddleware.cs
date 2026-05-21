namespace AspDotNet.Shared;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); 
        }
        catch (AppException ex)
        {
            _logger.LogError(ex, "Error Flow Bussinises");
            context.Response.StatusCode = ex.Code;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "Terjadi Kesalahan",
                detail = ex.Message
            };
            
            await context.Response.WriteAsJsonAsync(response);
        }

        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception terjadi");

            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "Terjadi kesalahan pada server",
                detail = ex.Message
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}