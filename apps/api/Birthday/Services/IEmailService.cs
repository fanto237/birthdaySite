using Birthday.Models;

namespace Birthday.Services;

public interface IEmailService
{
  Task<DateTime> SendEmailAsync(string name, int adultsNumber, int childrensNumber, string note, string subject, IReadOnlyCollection<Person> confirmedPersons, CancellationToken cancellationToken = default);
}
