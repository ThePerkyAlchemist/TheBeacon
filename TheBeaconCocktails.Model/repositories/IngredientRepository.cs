using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class IngredientRepository : BaseRepository
    {
        public IngredientRepository(IConfiguration configuration) : base(configuration) { }

        public List<Ingredient> GetAll()
        {
            var result = new List<Ingredient>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Ingredient";
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                result.Add(new Ingredient(Convert.ToInt32(reader["id"]))
                {
                    Name = reader["name"].ToString(),
                    Category = reader["category"].ToString(),
                    SubCategory = reader["subcategory"].ToString(),
                    BarCodeString = reader["barcodestring"].ToString(),
                    AlcPercentage = Convert.ToDecimal(reader["alcpercentage"])
                });
            }

            return result;
        }

        public Ingredient? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Ingredient WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new Ingredient(id)
                {
                    Name = reader["name"].ToString(),
                    Category = reader["category"].ToString(),
                    SubCategory = reader["subcategory"].ToString(),
                    BarCodeString = reader["barcodestring"].ToString(),
                    AlcPercentage = Convert.ToDecimal(reader["alcpercentage"])
                };
            }

            return null;
        }

        public bool Insert(Ingredient item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO Ingredient (name, category, subcategory, barcodestring, alcpercentage)
VALUES (@name, @category, @subcategory, @barcodestring, @alcpercentage);";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, item.Name);
            cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, item.Category);
            cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, item.SubCategory ?? "");
            cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, item.BarCodeString ?? "");
            cmd.Parameters.AddWithValue("@alcpercentage", NpgsqlDbType.Numeric, item.AlcPercentage);

            return InsertData(conn, cmd);
        }

        public bool Update(Ingredient item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE Ingredient SET
    name = @name,
    category = @category,
    subcategory = @subcategory,
    barcodestring = @barcodestring,
    alcpercentage = @alcpercentage
WHERE id = @id;";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, item.Name);
            cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, item.Category);
            cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, item.SubCategory ?? "");
            cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, item.BarCodeString ?? "");
            cmd.Parameters.AddWithValue("@alcpercentage", NpgsqlDbType.Numeric, item.AlcPercentage);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, item.Id);

            return UpdateData(conn, cmd);
        }

        public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Ingredient WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            return DeleteData(conn, cmd);
        }
    }
}