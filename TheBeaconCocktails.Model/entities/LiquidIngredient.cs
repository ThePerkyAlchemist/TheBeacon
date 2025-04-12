using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheBeaconCocktails.Model.entities
{
    public class LiquidIngredient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Category { get; set; }
        public string Subcategory { get; set; }
        public string Name { get; set; }
        public DateTime DateOfExpiry { get; set; }
        public decimal VolumePerUnit { get; set; }
        public int NumberOfUnits { get; set; }
        public string BarcodeString { get; set; }
        public string Status { get; set; }
    }
}
