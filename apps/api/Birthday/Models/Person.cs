namespace Birthday.Models;

public record class Person(Guid Id, string Name, int AdultsNumber, int ChildrensNumber, string Note, Guid InvitationId)
{

}
