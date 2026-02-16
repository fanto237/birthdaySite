using System;
using Serilog;

namespace Birthday.Middlewares;

public class InvitationMiddleware(ILogger<InvitationMiddleware> logger) : IMiddleware
{
  public async Task InvokeAsync(HttpContext context, RequestDelegate next)
  {
    logger.LogInformation("request started");

    await next.Invoke(context);
  }
}
