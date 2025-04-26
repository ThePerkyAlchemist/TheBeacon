using Microsoft.Extensions.Configuration;
using Npgsql;
using TheBeaconCocktails.Model.entities;
using System.Data;

namespace TheBeaconCocktails.Model.Repositories
{
    public class DrinkProfileRepository : BaseRepository
    {
        public DrinkProfileRepository(IConfiguration configuration) : base(configuration)
        {
        }

        // Get all DrinkProfiles
        public List<DrinkProfile> GetAll()
        {
            var result = new List<DrinkProfile>();

            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT
                    id,
                    recipeid,
                    description,
                    sweetnessorfruitiness,
                    richness,
                    booziness,
                    sourness,
                    freshness,
                    lightness,
                    timestamp
                FROM drinkprofile
            ";

            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                var profile = new DrinkProfile
                {
                    Id = Convert.ToInt32(reader["id"]),
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"]?.ToString(),
                    SweetnessOrFruitiness = reader["sweetnessorfruitiness"] != DBNull.Value ? Convert.ToDecimal(reader["sweetnessorfruitiness"]) : 0,
                    Richness = reader["richness"] != DBNull.Value ? Convert.ToDecimal(reader["richness"]) : 0,
                    Booziness = reader["booziness"] != DBNull.Value ? Convert.ToDecimal(reader["booziness"]) : 0,
                    Sourness = reader["sourness"] != DBNull.Value ? Convert.ToDecimal(reader["sourness"]) : 0,
                    Freshness = reader["freshness"] != DBNull.Value ? Convert.ToDecimal(reader["freshness"]) : 0,
                    Lightness = reader["lightness"] != DBNull.Value ? Convert.ToDecimal(reader["lightness"]) : 0,
                    Timestamp = reader["timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["timestamp"]) : DateTime.UtcNow
                };

                result.Add(profile);
            }

            return result;
        }

        // Get a single DrinkProfile by ID
        public DrinkProfile GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT
                    id,
                    recipeid,
                    description,
                    sweetnessorfruitiness,
                    richness,
                    booziness,
                    sourness,
                    freshness,
                    lightness,
                    timestamp
                FROM drinkprofile
                WHERE id = @id
            ";

            cmd.Parameters.AddWithValue("@id", id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new DrinkProfile
                {
                    Id = Convert.ToInt32(reader["id"]),
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"]?.ToString(),
                    SweetnessOrFruitiness = reader["sweetnessorfruitiness"] != DBNull.Value ? Convert.ToDecimal(reader["sweetnessorfruitiness"]) : 0,
                    Richness = reader["richness"] != DBNull.Value ? Convert.ToDecimal(reader["richness"]) : 0,
                    Booziness = reader["booziness"] != DBNull.Value ? Convert.ToDecimal(reader["booziness"]) : 0,
                    Sourness = reader["sourness"] != DBNull.Value ? Convert.ToDecimal(reader["sourness"]) : 0,
                    Freshness = reader["freshness"] != DBNull.Value ? Convert.ToDecimal(reader["freshness"]) : 0,
                    Lightness = reader["lightness"] != DBNull.Value ? Convert.ToDecimal(reader["lightness"]) : 0,
                    Timestamp = reader["timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["timestamp"]) : DateTime.UtcNow
                };
            }

            return null;
        }

        // Insert new DrinkProfile
        public bool InsertDrinkProfile(DrinkProfile p)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO drinkprofile
                (recipeid, description, sweetnessorfruitiness, richness, booziness, sourness, freshness, lightness)
                VALUES
                (@recipeid, @description, @sweetnessorfruitiness, @richness, @booziness, @sourness, @freshness, @lightness)
            ";

            cmd.Parameters.AddWithValue("@recipeid", p.RecipeId);
            cmd.Parameters.AddWithValue("@description", p.Description ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", p.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", p.Richness);
            cmd.Parameters.AddWithValue("@booziness", p.Booziness);
            cmd.Parameters.AddWithValue("@sourness", p.Sourness);
            cmd.Parameters.AddWithValue("@freshness", p.Freshness);
            cmd.Parameters.AddWithValue("@lightness", p.Lightness);

            return InsertData(conn, cmd);
        }

        // Update existing DrinkProfile
        public bool UpdateDrinkProfile(DrinkProfile p)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE drinkprofile SET
                    recipeid = @recipeid,
                    description = @description,
                    sweetnessorfruitiness = @sweetnessorfruitiness,
                    richness = @richness,
                    booziness = @booziness,
                    sourness = @sourness,
                    freshness = @freshness,
                    lightness = @lightness
                WHERE id = @id
            ";

            cmd.Parameters.AddWithValue("@id", p.Id);
            cmd.Parameters.AddWithValue("@recipeid", p.RecipeId);
            cmd.Parameters.AddWithValue("@description", p.Description ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", p.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", p.Richness);
            cmd.Parameters.AddWithValue("@booziness", p.Booziness);
            cmd.Parameters.AddWithValue("@sourness", p.Sourness);
            cmd.Parameters.AddWithValue("@freshness", p.Freshness);
            cmd.Parameters.AddWithValue("@lightness", p.Lightness);

            return InsertData(conn, cmd);
        }

        // Delete a DrinkProfile
        public bool DeleteDrinkProfile(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                DELETE FROM drinkprofile
                WHERE id = @id
            ";

            cmd.Parameters.AddWithValue("@id", id);

            return InsertData(conn, cmd);
        }
    }
}
