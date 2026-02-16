// using System;
// using Birthday.Data;
// using Birthday.Models;
// using Birthday.Repository;

// namespace Birthday.Services;

// public class InvitationService(IInvitationRepository repository, ILogger<InvitationService> logger) : IInvitatonService
// {
//   public async Task<bool> CreateNewInvitation(Invitation invitation)
//   {
//     if (invitation is null)
//     {
//       logger.LogError("@inviation can not be null");
//       return false;
//     }

//     await repository.CreateInvitation(invitation);
//     return true;
//   }

//   public async Task<List<Invitation>> GetAllInvitation()
//   {
//     var result = await repository.GetAllInvitations();
//     return result;
//   }
// }
