using System;
using Birthday.Data;
using Birthday.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Birthday.Repository;

public class InvitationRepository(ApplicationDbContext context, Serilog.ILogger logger) : IInvitationRepository
{
  private readonly Serilog.ILogger _logger = logger;

  public async Task CreateInvitation(Invitation invitation)
  {
    try
    {
      _logger.Information("Creating invitation for person ID: {PersonId}", invitation.PersonId);
      await context.Invitations.AddAsync(invitation);
      await context.SaveChangesAsync();
      _logger.Information("Invitation successfully created for person ID: {PersonId}", invitation.PersonId);
    }
    catch (Exception ex)
    {
      _logger.Error(ex, "An error occurred while creating invitation for person ID: {PersonId}", invitation.PersonId);
      throw;
    }
  }

  public async Task<List<Invitation>> GetAllInvitations()
  {
    try
    {
      _logger.Debug("Retrieving all invitations");
      var result = await context.Invitations.ToListAsync();
      _logger.Information("Retrieved {InvitationCount} invitations", result.Count);
      return result;
    }
    catch (Exception ex)
    {
      _logger.Error(ex, "An error occurred while retrieving invitations");
      throw;
    }
  }
}
