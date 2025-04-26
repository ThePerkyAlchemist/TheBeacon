using Microsoft.Extensions.Configuration;
using Npgsql;
using TheBeaconCocktails.Model.entities;
using System.Data; // Needed for ConnectionState checking if necessary

namespace TheBeaconCocktails.Model.Repositories
{
    public class RecipeRepository : BaseRepository
    {
        public RecipeRepository(IConfiguration configuration) : base(configuration)
        {
        }

        // Get all Recipes
        public List<Recipe> GetAll()
        {
            var result = new List<Recipe>();

            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT 
                    r.id, 
                    r.recipeid, 
                    r.name AS recipename,
                    r.liquidid, 
                    r.liquidingredientvolumeml,
                    l.name AS liquidname
                FROM recipe r
                JOIN liquidingredient l ON r.liquidid = l.id
            ";

            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                var recipe = new Recipe
                {
                    Id = Convert.ToInt32(reader["id"]),
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Name = reader["recipename"]?.ToString(),
                    LiquidId = Convert.ToInt32(reader["liquidid"]),
                    LiquidName = reader["liquidname"]?.ToString(),
                    LiquidIngredientVolumeMl = Convert.ToInt32(reader["liquidingredientvolumeml"])
                };

                result.Add(recipe);
            }

            return result;
        }

        // Get a single recipe by ID
        public Recipe GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT 
                    r.id, 
                    r.recipeid, 
                    r.name AS recipename,  
                    r.liquidid, 
                    r.liquidingredientvolumeml,
                    l.name AS liquidname
                FROM recipe r
                JOIN liquidingredient l ON r.liquidid = l.id
                WHERE r.id = @id
            ";

            cmd.Parameters.AddWithValue("@id", id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new Recipe
                {
                    Id = Convert.ToInt32(reader["id"]),
                    RecipeId = Convert.ToInt32(reader["recipeid"]),
                    Name = reader["recipename"]?.ToString(),
                    LiquidId = Convert.ToInt32(reader["liquidid"]),
                    LiquidName = reader["liquidname"]?.ToString(),
                    LiquidIngredientVolumeMl = Convert.ToInt32(reader["liquidingredientvolumeml"])
                };
            }

            return null;
        }

        // Add a new Recipe
        public bool InsertRecipe(Recipe r)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO recipe
                (recipeid, name, liquidid, liquidingredientvolumeml)
                VALUES
                (@recipeid, @name, @liquidid, @liquidingredientvolumeml)
            ";

            cmd.Parameters.AddWithValue("@recipeid", r.RecipeId);
            cmd.Parameters.AddWithValue("@name", r.Name ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@liquidid", r.LiquidId);
            cmd.Parameters.AddWithValue("@liquidingredientvolumeml", r.LiquidIngredientVolumeMl);

            return InsertData(conn, cmd);
        }

        // Update an existing Recipe
        public bool UpdateRecipe(Recipe r)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE recipe SET
                    recipeid = @recipeid,
                    name = @name,
                    liquidid = @liquidid,
                    liquidingredientvolumeml = @liquidingredientvolumeml
                WHERE id = @id
            ";

            cmd.Parameters.AddWithValue("@id", r.Id);
            cmd.Parameters.AddWithValue("@recipeid", r.RecipeId);
            cmd.Parameters.AddWithValue("@name", r.Name ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@liquidid", r.LiquidId);
            cmd.Parameters.AddWithValue("@liquidingredientvolumeml", r.LiquidIngredientVolumeMl);

            return InsertData(conn, cmd);
        }

        // Delete a Recipe by ID
        public bool DeleteRecipe(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                DELETE FROM recipe WHERE id = @id
            ";

            cmd.Parameters.AddWithValue("@id", id);

            return InsertData(conn, cmd);
        }
    }
}
