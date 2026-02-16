using Birthday.DTOs;

namespace Birthday.Services;

public interface IEmailService
{
  Task<DateTime> SendEmailAsync(string name, int adultsNumber, int childrensNumber, string note, string subject, CancellationToken cancellationToken = default);
}
