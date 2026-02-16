namespace Birthday.Models;

public record class Invitation(Guid Id, DateTime CreateAt, DateTime NotificationSentAt, Guid PersonId)
{ }