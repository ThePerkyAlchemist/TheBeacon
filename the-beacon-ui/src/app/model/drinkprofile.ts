export interface DrinkProfile {
    id: number;
    recipeId: number;
    description: string;
    sweetnessOrFruitiness: number;
    richness: number;
    booziness: number;
    sourness: number;
    freshness: number;
    lightness: number;
    timestamp?: string;
  }
  