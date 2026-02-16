using System;
using Birthday.Models;

namespace Birthday.Repository;

public interface IInvitationRepository
{
  Task<List<Invitation>> GetAllInvitations();
  Task CreateInvitation(Invitation invitation);
}
