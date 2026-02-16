using System;

namespace Birthday.Models;

public class Response
{
  public required string Status { get; set; }
  public required Object Result { get; set; }
}
