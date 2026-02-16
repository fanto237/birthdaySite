namespace Birthday.DTOs;

public class CreateInvitationRequest
{
    public required string Name { get; set; }
    public int AdultsNumber { get; set; }
    public int ChildrensNumber { get; set; }
    public required string Note { get; set; }
}
