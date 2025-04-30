using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.Model.Repositories
{
    public class StockRepository : BaseRepository
    {
        public StockRepository(IConfiguration configuration) : base(configuration) { }

        // GET ALL
        public List<Stock> GetAll()
        {
            var result = new List<Stock>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Stock";

            var reader = GetData(conn, cmd);
            while (reader.Read())
            {
                var stock = new Stock
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Category = reader["category"]?.ToString(),
                    SubCategory = reader["subcategory"]?.ToString(),
                    Name = reader["name"]?.ToString(),
                    DateOfExpiry = Convert.ToDateTime(reader["dateofexpiry"]),
                    VolumePerUnit = Convert.ToDecimal(reader["volumeperunit"]),
                    NumberOfUnits = Convert.ToInt32(reader["numberofunits"]),
                    Status = reader["status"]?.ToString(),
                    BarCodeString = reader["barcodestring"]?.ToString()
                };
                result.Add(stock);
            }

            return result;
        }

        // GET BY ID
        public Stock? GetById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Stock WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                return new Stock
                {
                    Id = id,
                    Category = reader["category"]?.ToString(),
                    SubCategory = reader["subcategory"]?.ToString(),
                    Name = reader["name"]?.ToString(),
                    DateOfExpiry = Convert.ToDateTime(reader["dateofexpiry"]),
                    VolumePerUnit = Convert.ToDecimal(reader["volumeperunit"]),
                    NumberOfUnits = Convert.ToInt32(reader["numberofunits"]),
                    Status = reader["status"]?.ToString(),
                    BarCodeString = reader["barcodestring"]?.ToString()
                };
            }

            return null;
        }

        // INSERT NEW STOCK
        public bool Insert(Stock stock)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO Stock
(category, subcategory, name, dateofexpiry, volumeperunit, numberofunits, status, barcodestring)
VALUES (@category, @subcategory, @name, @dateofexpiry, @volumeperunit, @numberofunits, @status, @barcodestring);
";
            cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, stock.Category);
            cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, stock.SubCategory);
            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, stock.Name);
            cmd.Parameters.AddWithValue("@dateofexpiry", NpgsqlDbType.Date, stock.DateOfExpiry);
            cmd.Parameters.AddWithValue("@volumeperunit", NpgsqlDbType.Numeric, stock.VolumePerUnit);
            cmd.Parameters.AddWithValue("@numberofunits", NpgsqlDbType.Integer, stock.NumberOfUnits);
            cmd.Parameters.AddWithValue("@status", NpgsqlDbType.Text, stock.Status);
            cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, stock.BarCodeString);

            return InsertData(conn, cmd);
        }

        // SLET
        //I just noticed that this most likely deletes all the bottles regardless of how many of them are in stock 2025.04.23
        //TODO only deduct as many as the user indicates on the UI. 
        //probably a for loop on numbers until i  or stock = 0. if stock = 0, throw error
       public bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Stock WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);
            return DeleteData(conn, cmd);
        }

        // UPDATE STOCK
        public bool Update(Stock stock)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE Stock SET
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
            cmd.Parameters.AddWithValue("@category", NpgsqlDbType.Text, stock.Category);
            cmd.Parameters.AddWithValue("@subcategory", NpgsqlDbType.Text, stock.SubCategory);
            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, stock.Name);
            cmd.Parameters.AddWithValue("@dateofexpiry", NpgsqlDbType.Date, stock.DateOfExpiry);
            cmd.Parameters.AddWithValue("@volumeperunit", NpgsqlDbType.Numeric, stock.VolumePerUnit);
            cmd.Parameters.AddWithValue("@numberofunits", NpgsqlDbType.Integer, stock.NumberOfUnits);
            cmd.Parameters.AddWithValue("@status", NpgsqlDbType.Text, stock.Status);
            cmd.Parameters.AddWithValue("@barcodestring", NpgsqlDbType.Text, stock.BarCodeString);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, stock.Id);

            return UpdateData(conn, cmd);
        }
    }
}