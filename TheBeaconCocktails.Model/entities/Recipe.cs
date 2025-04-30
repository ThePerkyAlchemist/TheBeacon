using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheBeaconCocktails.Model.entities
{
public class Recipe
{
    public Recipe(int id) { Id = id; }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Name { get; set; }

    [ForeignKey("Ingredient")]
    public int IngredientId { get; set; }

    public int VolumeML { get; set; }
}
}
