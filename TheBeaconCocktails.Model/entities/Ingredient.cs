using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class Ingredient
{
    public Ingredient(int id) { Id = id; }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Name { get; set; }
    public string Category { get; set; }
    public string SubCategory { get; set; }
    public string BarCodeString { get; set; }
    public decimal AlcPercentage { get; set; }
}