using Microsoft.Extensions.Configuration;
using Npgsql;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class DrinkProfileRepository : BaseRepository
    {
        public DrinkProfileRepository(IConfiguration configuration) : base(configuration) { }

        // Get all DrinkProfiles
        public List<DrinkProfile> GetAll()
        {
            var result = new List<DrinkProfile>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM DrinkProfile";

            var reader = GetData(conn, cmd);
            while (reader.Read())
            {
                var dp = new DrinkProfile
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Recipeid = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"]?.ToString(),
                    SweetnessOrFruitiness = Convert.ToDecimal(reader["sweetnessorfruitiness"]),
                    Richness = Convert.ToDecimal(reader["richness"]),
                    Booziness = Convert.ToDecimal(reader["booziness"]),
                    Sourness = Convert.ToDecimal(reader["sourness"]),
                    Freshness = Convert.ToDecimal(reader["freshness"]),
                    Lightness = Convert.ToDecimal(reader["lightness"]),
                    Timestamp = Convert.ToDateTime(reader["timestamp"])
                };
                result.Add(dp);
            }

            return result;
        }

        // Get a single DrinkProfile by ID
        public DrinkProfile? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM DrinkProfile WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new DrinkProfile
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Recipeid = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"]?.ToString(),
                    SweetnessOrFruitiness = Convert.ToDecimal(reader["sweetnessorfruitiness"]),
                    Richness = Convert.ToDecimal(reader["richness"]),
                    Booziness = Convert.ToDecimal(reader["booziness"]),
                    Sourness = Convert.ToDecimal(reader["sourness"]),
                    Freshness = Convert.ToDecimal(reader["freshness"]),
                    Lightness = Convert.ToDecimal(reader["lightness"]),
                    Timestamp = Convert.ToDateTime(reader["timestamp"])
                };
            }

            return null;
        }

        // Insert a new DrinkProfile
        public bool Insert(DrinkProfile dp)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO DrinkProfile
(recipeid, description, sweetnessorfruitiness, richness, booziness, sourness, freshness, lightness, timestamp)
VALUES
(@recipeid, @description, @sweetnessorfruitiness, @richness, @booziness, @sourness, @freshness, @lightness, @timestamp)
";
            cmd.Parameters.AddWithValue("@recipeid", dp.Recipeid);
            cmd.Parameters.AddWithValue("@description", dp.Description ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", dp.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", dp.Richness);
            cmd.Parameters.AddWithValue("@booziness", dp.Booziness);
            cmd.Parameters.AddWithValue("@sourness", dp.Sourness);
            cmd.Parameters.AddWithValue("@freshness", dp.Freshness);
            cmd.Parameters.AddWithValue("@lightness", dp.Lightness);
            cmd.Parameters.AddWithValue("@timestamp", dp.Timestamp);

            return InsertData(conn, cmd);
        }

        // Delete a DrinkProfile by ID
        public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM DrinkProfile WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", id);
            return DeleteData(conn, cmd);
        }

        // Update an existing DrinkProfile
        public bool Update(DrinkProfile dp)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE DrinkProfile SET
    recipeid = @recipeid,
    description = @description,
    sweetnessorfruitiness = @sweetnessorfruitiness,
    richness = @richness,
    booziness = @booziness,
    sourness = @sourness,
    freshness = @freshness,
    lightness = @lightness,
    timestamp = @timestamp
WHERE id = @id;
";
            cmd.Parameters.AddWithValue("@recipeid", dp.Recipeid);
            cmd.Parameters.AddWithValue("@description", dp.Description ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", dp.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", dp.Richness);
            cmd.Parameters.AddWithValue("@booziness", dp.Booziness);
            cmd.Parameters.AddWithValue("@sourness", dp.Sourness);
            cmd.Parameters.AddWithValue("@freshness", dp.Freshness);
            cmd.Parameters.AddWithValue("@lightness", dp.Lightness);
            cmd.Parameters.AddWithValue("@timestamp", dp.Timestamp);
            cmd.Parameters.AddWithValue("@id", dp.Id);

            return UpdateData(conn, cmd);
        }
    }
}