using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class RecipeRepository : BaseRepository
    {
        public RecipeRepository(IConfiguration configuration) : base(configuration) { }

        public List<Recipe> GetAll()
        {
            var result = new List<Recipe>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Recipe";
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                result.Add(new Recipe(Convert.ToInt32(reader["id"]))
                {
                    Name = reader["name"].ToString(),
                    IngredientId = Convert.ToInt32(reader["ingredientid"]),
                    VolumeML = Convert.ToInt32(reader["volumeml"])
                });
            }

            return result;
        }

        public Recipe? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Recipe WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new Recipe(id)
                {
                    Name = reader["name"].ToString(),
                    IngredientId = Convert.ToInt32(reader["ingredientid"]),
                    VolumeML = Convert.ToInt32(reader["volumeml"])
                };
            }

            return null;
        }

        public bool Insert(Recipe recipe)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO Recipe (name, ingredientid, volumeml)
VALUES (@name, @ingredientid, @volumeml);";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, recipe.Name);
            cmd.Parameters.AddWithValue("@ingredientid", NpgsqlDbType.Integer, recipe.IngredientId);
            cmd.Parameters.AddWithValue("@volumeml", NpgsqlDbType.Integer, recipe.VolumeML);

            return InsertData(conn, cmd);
        }

        public bool Update(Recipe recipe)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE Recipe SET
    name = @name,
    ingredientid = @ingredientid,
    volumeml = @volumeml
WHERE id = @id;";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, recipe.Name);
            cmd.Parameters.AddWithValue("@ingredientid", NpgsqlDbType.Integer, recipe.IngredientId);
            cmd.Parameters.AddWithValue("@volumeml", NpgsqlDbType.Integer, recipe.VolumeML);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, recipe.Id);

            return UpdateData(conn, cmd);
        }

        public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Recipe WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            return DeleteData(conn, cmd);
        }
    }
}
