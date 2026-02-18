using System;
using Birthday.Models;

namespace Birthday.Repository;

public interface IPersonRepository
{
  Task AddPerson(Person person);
  Task<List<Person>> GetAllConfirmedPersons();
}
