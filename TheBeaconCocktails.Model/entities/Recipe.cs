namespace TheBeaconCocktails.Model.entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public int RecipeId { get; set; } // henviser til opskriftens id
        public string Name { get; set; }
        public int LiquidId { get; set; } // henviser til ingrediensen
        public int LiquidIngredientVolumeMl { get; set; }
        public string LiquidName { get; set; } // <-- ny linje
    }
}
