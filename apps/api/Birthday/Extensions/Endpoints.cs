using System;
using Birthday.DTOs;
using Birthday.Models;
using Birthday.Repository;
using Birthday.Services;
using Serilog;

namespace Birthday.Extensions;

public static class WebApplicationExtensions
{

  public static WebApplication MapEndpoints(this WebApplication app)
  {

    var group = app.MapGroup("/api/invitations");

    group.MapPost("/", CreateInvitation)
      .WithName("Create Inviation")
      .WithDescription("Endpoint for creating new invitation and person");

    return app;
  }

  private static async Task<IResult> CreateInvitation(CreateInvitationRequest request, Serilog.ILogger logger, IInvitationRepository invitationRepository, IPersonRepository personRepository, IEmailService emailService)
  {

    if (string.IsNullOrWhiteSpace(request?.Name))
    {
      logger.Information("Person info cannot be null or empty");
      var response = new Response { Status = "failed", Result = "The person can not be null" };
      return Results.BadRequest(response);
    }
    var personId = Guid.NewGuid();
    var invitationId = Guid.NewGuid();
    var createAt = DateTime.UtcNow;

    var sentAt = await emailService.SendEmailAsync(request.Name, request.AdultsNumber, request.ChildrensNumber, request.Note, $"Bithday Confirmation for {request.Name}");

    var person = new Person(personId, request.Name, request.AdultsNumber, request.ChildrensNumber, request.Note, invitationId);
    var invitation = new Invitation(invitationId, createAt, sentAt, personId);

    await personRepository.AddPerson(person);
    await invitationRepository.CreateInvitation(invitation);

    logger.Information("Invitation with Id {InvitationId} has been created for person {PersonName}", invitationId, person.Name);
    return Results.Ok();
  }
}
