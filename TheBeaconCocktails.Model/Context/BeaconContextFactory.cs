using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TheBeaconCocktails.Model.Entities;

namespace TheBeaconCocktails.Model.Context
{
    public class BeaconDbContextFactory : IDesignTimeDbContextFactory<BeaconDbContext>
    {
        public BeaconDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BeaconDbContext>();

            // Provide the same connection string as in your appsettings.json
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=admin;Database=TheBeacon");

            return new BeaconDbContext(optionsBuilder.Options);
        }
    }
}
