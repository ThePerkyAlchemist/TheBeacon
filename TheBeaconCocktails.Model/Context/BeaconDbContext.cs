using Microsoft.EntityFrameworkCore;

using TheBeaconCocktails.Model.Entities;

namespace TheBeaconCocktails.Model.Context
{
    public class BeaconDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public BeaconDbContext(DbContextOptions<BeaconDbContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var passwordHash = "$2a$11$Hkq8LJ0vym5m7U7L2eexyOTbx5NBqz1z/8KnyDj4tKymwnFuBdOnK";


            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "john.doe",
                PasswordHash = passwordHash
            });
        }
    }
}
