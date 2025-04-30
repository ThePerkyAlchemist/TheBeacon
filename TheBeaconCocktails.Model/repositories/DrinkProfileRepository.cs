using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class DrinkProfileRepository : BaseRepository
    {
        public DrinkProfileRepository(IConfiguration configuration) : base(configuration) { }

        public List<DrinkProfile> GetAll()
        {
            var result = new List<DrinkProfile>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM DrinkProfile";
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                result.Add(new DrinkProfile(Convert.ToInt32(reader["id"]))
                {
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"].ToString(),
                    SweetnessOrFruitiness = Convert.ToDecimal(reader["sweetnessorfruitiness"]),
                    Richness = Convert.ToDecimal(reader["richness"]),
                    Booziness = Convert.ToDecimal(reader["booziness"]),
                    Sourness = Convert.ToDecimal(reader["sourness"]),
                    Freshness = Convert.ToDecimal(reader["freshness"]),
                    Lightness = Convert.ToDecimal(reader["lightness"]),
                    Timestamp = Convert.ToDateTime(reader["timestamp"])
                });
            }

            return result;
        }

        public DrinkProfile? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM DrinkProfile WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new DrinkProfile(id)
                {
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Description = reader["description"].ToString(),
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

        public bool Insert(DrinkProfile dp)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO DrinkProfile (recipeid, description, sweetnessorfruitiness, richness, booziness, sourness, freshness, lightness)
VALUES (@recipeid, @description, @sweetnessorfruitiness, @richness, @booziness, @sourness, @freshness, @lightness);";

            cmd.Parameters.AddWithValue("@recipeid", NpgsqlDbType.Integer, dp.RecipeId);
            cmd.Parameters.AddWithValue("@description", NpgsqlDbType.Text, dp.Description);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", NpgsqlDbType.Numeric, dp.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", NpgsqlDbType.Numeric, dp.Richness);
            cmd.Parameters.AddWithValue("@booziness", NpgsqlDbType.Numeric, dp.Booziness);
            cmd.Parameters.AddWithValue("@sourness", NpgsqlDbType.Numeric, dp.Sourness);
            cmd.Parameters.AddWithValue("@freshness", NpgsqlDbType.Numeric, dp.Freshness);
            cmd.Parameters.AddWithValue("@lightness", NpgsqlDbType.Numeric, dp.Lightness);

            return InsertData(conn, cmd);
        }

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
    lightness = @lightness
WHERE id = @id;";

            cmd.Parameters.AddWithValue("@recipeid", NpgsqlDbType.Integer, dp.RecipeId);
            cmd.Parameters.AddWithValue("@description", NpgsqlDbType.Text, dp.Description);
            cmd.Parameters.AddWithValue("@sweetnessorfruitiness", NpgsqlDbType.Numeric, dp.SweetnessOrFruitiness);
            cmd.Parameters.AddWithValue("@richness", NpgsqlDbType.Numeric, dp.Richness);
            cmd.Parameters.AddWithValue("@booziness", NpgsqlDbType.Numeric, dp.Booziness);
            cmd.Parameters.AddWithValue("@sourness", NpgsqlDbType.Numeric, dp.Sourness);
            cmd.Parameters.AddWithValue("@freshness", NpgsqlDbType.Numeric, dp.Freshness);
            cmd.Parameters.AddWithValue("@lightness", NpgsqlDbType.Numeric, dp.Lightness);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, dp.Id);

            return UpdateData(conn, cmd);
        }

        public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM DrinkProfile WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            return DeleteData(conn, cmd);
        }
    }
}
