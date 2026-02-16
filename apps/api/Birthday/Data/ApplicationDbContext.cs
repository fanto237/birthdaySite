using Birthday.Models;
using Microsoft.EntityFrameworkCore;

namespace Birthday.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
  public DbSet<Person> Persons => Set<Person>();
  public DbSet<Invitation> Invitations => Set<Invitation>();
}
