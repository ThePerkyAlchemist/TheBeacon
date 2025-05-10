using System.Text;
using Microsoft.AspNetCore.Authorization;
namespace TheBeaconCocktails.API.Middleware;
public class BasicAuthenticationMiddleware
{
    // Ideally, we would want to verfy them against a database
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

    // 1. Try to retrieve the Request Header containing our secret value
    string? authHeader = context.Request.Headers["Authorization"];

    // 2. If not found, then return with Unauthorized response
    if (authHeader == null)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Authorization Header value not provided");
        return;
    }

    //  NEW: Use AuthenticationHelper
    AuthenticationHelper.Decrypt(authHeader, out string username, out string password);

    // 3. Check if both username and password are correct
    if (username == USERNAME && password == PASSWORD)
    {
        await _next(context);
    }
    else
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Incorrect credentials provided");
        return;
    }
}

}
public static class BasicAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseBasicAuthenticationMiddleware(this
    IApplicationBuilder builder)
    {
        return builder.UseMiddleware<BasicAuthenticationMiddleware>();
    }
}