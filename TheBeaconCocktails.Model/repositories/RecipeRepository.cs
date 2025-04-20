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
    }
}
