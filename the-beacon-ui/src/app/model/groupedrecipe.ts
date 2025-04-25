export interface GroupedRecipe {
    id: number;
    name: string;
    ingredients: {
      liquidName: string;
      liquidIngredientVolumeMl: number;
    }[];
  }
  