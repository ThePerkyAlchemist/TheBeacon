using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class LiquidIngredientRepository : BaseRepository
    {
        public LiquidIngredientRepository(IConfiguration configuration) : base(configuration) { }

        // HENTER ALLE RÆKKER
        public List<LiquidIngredient> GetAll()
        {
            var result = new List<LiquidIngredient>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM LiquidIngredient";

            var reader = GetData(conn, cmd);
            while (reader.Read())
            {
                var li = new LiquidIngredient
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Category = reader["category"]?.ToString(),
                    Subcategory = reader["subcategory"]?.ToString(),
                    Name = reader["name"]?.ToString(),
                    DateOfExpiry = Convert.ToDateTime(reader["dateofexpiry"]),
                    VolumePerUnit = Convert.ToDecimal(reader["volumeperunit"]),
                    NumberOfUnits = Convert.ToInt32(reader["numberofunits"]),
                    Status = reader["status"]?.ToString(),
                    BarcodeString = reader["barcodestring"]?.ToString()
                };
                result.Add(li);
            }

            return result;
        }

        // HENTER ÉN RÆKKE EFTER ID
        public LiquidIngredient? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM LiquidIngredient WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new LiquidIngredient
                {
                    Id = id,
                    Category = reader["category"]?.ToString(),
                    Subcategory = reader["subcategory"]?.ToString(),
                    Name = reader["name"]?.ToString(),
                    DateOfExpiry = Convert.ToDateTime(reader["dateofexpiry"]),
                    VolumePerUnit = Convert.ToDecimal(reader["volumeperunit"]),
                    NumberOfUnits = Convert.ToInt32(reader["numberofunits"]),
                    Status = reader["status"]?.ToString(),
                    BarcodeString = reader["barcodestring"]?.ToString()
                };
            }

            return null;
        }

        // INDSÆT NY INGREDIENS
public bool Insert(LiquidIngredient li)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    var cmd = conn.CreateCommand();
    cmd.CommandText = @"
INSERT INTO LiquidIngredient
(category, subcategory, name, dateofexpiry, volumeperunit, numberofunits, status, barcodestring)
VALUES (@category, @subcategory, @name, @dateofexpiry, @volumeperunit, @numberofunits, @status, @barcodestring);
";
    cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, li.Category);
    cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, li.Subcategory);
    cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, li.Name);
    cmd.Parameters.AddWithValue("@dateofexpiry", NpgsqlDbType.Date, li.DateOfExpiry);
    cmd.Parameters.AddWithValue("@volumeperunit", NpgsqlDbType.Numeric, li.VolumePerUnit);
    cmd.Parameters.AddWithValue("@numberofunits", NpgsqlDbType.Integer, li.NumberOfUnits);
    cmd.Parameters.AddWithValue("@status", NpgsqlDbType.Text, li.Status);
    cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, li.BarcodeString);

    return InsertData(conn, cmd);
}

        // SLET
        public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM LiquidIngredient WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            return DeleteData(conn, cmd);
        }

        // OPDATER
        public bool Update(LiquidIngredient li)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE LiquidIngredient SET
    category = @category,
    subcategory = @subcategory,
    name = @name,
    dateofexpiry = @dateofexpiry,
    volumeperunit = @volumeperunit,
    numberofunits = @numberofunits,
    status = @status,
    barcodestring = @barcodestring
WHERE id = @id;
";
            cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, li.Category);
            cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, li.Subcategory);
            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, li.Name);
            cmd.Parameters.AddWithValue("@dateofexpiry", NpgsqlDbType.Date, li.DateOfExpiry);
            cmd.Parameters.AddWithValue("@volumeperunit", NpgsqlDbType.Numeric, li.VolumePerUnit);
            cmd.Parameters.AddWithValue("@numberofunits", NpgsqlDbType.Integer, li.NumberOfUnits);
            cmd.Parameters.AddWithValue("@status", NpgsqlDbType.Text, li.Status);
            cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, li.BarcodeString);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, li.Id);

            return UpdateData(conn, cmd);
        }
    }
}
