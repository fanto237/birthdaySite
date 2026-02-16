namespace Birthday.Models;

public sealed class EmailOptions
{
  public const string SectionName = "EmailSettings";

  public string Server { get; set; } = string.Empty;
  public int Port { get; set; } = 587;
  public string From { get; set; } = string.Empty;
  public string To { get; set; } = string.Empty;
  public string SenderName { get; set; } = string.Empty;
  public string Username { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;

}
