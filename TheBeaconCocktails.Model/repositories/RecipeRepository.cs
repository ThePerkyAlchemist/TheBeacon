using Microsoft.Extensions.Configuration;
using Npgsql;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class RecipeRepository : BaseRepository
    {
        public RecipeRepository(IConfiguration configuration) : base(configuration)
        {
        }

//Get all Recipes
        public List<Recipe> GetAll()
        {
            var result = new List<Recipe>();

            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
         cmd.CommandText = @"
            SELECT 
                r.id, 
                r.recipeid, 
                r.name AS recipename,  -- <== RETTET!
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

//Add new recipe
        public bool InsertRecipe(Recipe r) //I do not know if this syntax is correct
        {
            //NpgsqlConnection dbConn = null;
            using var dbConn = new NpgsqlConnection(ConnectionString); 
            try{
                dbConn.Open();
                //conn = new NpgsqlConnection(ConnectionString);
                var cmd = dbConn.CreateCommand();
                cmd.CommandText = @"
            INSERT INTO recipe
            (id, recipeid, name, liquidid, liquidingredientvolumeml)
            VALUES
            (@id, @recipeid, @name, @liquidid, @liquidingredientvolumeml)
        ";

            cmd.Parameters.AddWithValue("@id", r.Id);
            cmd.Parameters.AddWithValue("@recipeid", r.RecipeId);
            cmd.Parameters.AddWithValue("@name", r.Name ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@liquidid", r.LiquidId);
            cmd.Parameters.AddWithValue("@liquidingredientvolumeml", r.LiquidIngredientVolumeMl);


                //will return true if all goes well
                bool result = InsertData(dbConn, cmd);

                return result;
            }
            finally
            {
                dbConn?.Close();
            }
        }
  // Update an existing recipe
        public bool UpdateRecipe(Recipe r)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            try
            {
                dbConn.Open();

                var cmd = dbConn.CreateCommand();
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

                return InsertData(dbConn, cmd); // Same helper used for non-query commands
            }
            finally
            {
                dbConn?.Close();
            }
        }

        // Delete a recipe by ID
        public bool DeleteRecipe(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            try
            {
                dbConn.Open();

                var cmd = dbConn.CreateCommand();
                cmd.CommandText = @"
                    DELETE FROM recipe WHERE id = @id
                ";
                cmd.Parameters.AddWithValue("@id", id);

                return InsertData(dbConn, cmd); // Works for DELETE too
            }
            finally
            {
                dbConn?.Close();
            }
        }  
                            
                            
            
        
    }
}
