using System;
using Birthday.Data;
using Birthday.Models;
using Serilog;

namespace Birthday.Repository;

public class PersonRepository(ApplicationDbContext context, Serilog.ILogger logger) : IPersonRepository
{
  private readonly Serilog.ILogger _logger = logger;

  public async Task AddPerson(Person person)
  {
    try
    {
      _logger.Information("Adding person: {PersonName}", person.Name);
      await context.Persons.AddAsync(person);
      await context.SaveChangesAsync();
      _logger.Information("Person successfully added: {PersonName}", person.Name);
    }
    catch (Exception ex)
    {
      _logger.Error(ex, "An error occurred while adding person: {PersonName}", person.Name);
      throw;
    }
  }
}
