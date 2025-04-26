using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheBeaconCocktails.Model.entities
{
    public class DrinkProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int RecipeId { get; set; }
        public string Description { get; set; }
        public decimal SweetnessOrFruitiness { get; set; }
        public  decimal Richness { get; set; }
        public decimal Booziness { get; set; }
        public decimal Sourness { get; set; }
        public decimal  Freshness { get; set; }
        public decimal Lightness { get; set; }
        public DateTime Timestamp { get; set; }
}
}
