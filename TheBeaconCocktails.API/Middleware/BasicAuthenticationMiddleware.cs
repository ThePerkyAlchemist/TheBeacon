using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace TheBeaconCocktails.API.Middleware;

public class BasicAuthenticationMiddleware
{
    private const string USERNAME = "john.doe";
    private const string PASSWORD = "VerySecret!";

    private readonly RequestDelegate _next;

    public BasicAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Bypass authentication for [AllowAnonymous]
        if (context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
        {
            await _next(context);
            return;
        }

        // 1. Try to retrieve the Authorization header
        string? authHeader = context.Request.Headers["Authorization"];

        // 2. If not found, return Unauthorized
        if (authHeader == null || !authHeader.StartsWith("Basic "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Authorization Header value not provided");
            return;
        }

        try
        {
            // 3. Decode and extract username and password
            var auth = authHeader.Split(' ')[1];
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(auth));
            var parts = decoded.Split(':');
            var username = parts[0];
            var password = parts[1];

            // 4. Check against hardcoded credentials
            if (username == USERNAME && password == PASSWORD)
            {
                await _next(context); // ✅ Authenticated
                return;
            }

            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Incorrect credentials provided");
        }
        catch
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid Authorization header");
        }
    }
}

public static class BasicAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseBasicAuthenticationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<BasicAuthenticationMiddleware>();
    }
}
