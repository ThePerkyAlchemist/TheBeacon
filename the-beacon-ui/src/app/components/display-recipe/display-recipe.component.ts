import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Recipe {
  id: number;
  recipeId: number;
  name: string;
  liquidId: number;
  liquidName: string;
  liquidIngredientVolumeMl: number;
}

interface GroupedRecipe {
  name: string;
  ingredients: {
    liquidName: string;
    liquidIngredientVolumeMl: number;
  }[];
}

@Component({
  selector: 'app-display-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-recipe.component.html',
  styleUrls: ['./display-recipe.component.css']
})
export class DisplayRecipeComponent implements OnInit {
  groupedRecipes: GroupedRecipe[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Recipe[]>('http://localhost:5146/api/recipe').subscribe({
      next: (data) => {
        const map = new Map<string, GroupedRecipe>();

        for (const r of data) {
          if (!map.has(r.name)) {
            map.set(r.name, {
              name: r.name,
              ingredients: [],
            });
          }
          map.get(r.name)!.ingredients.push({
            liquidName: r.liquidName,
            liquidIngredientVolumeMl: r.liquidIngredientVolumeMl
          });
        }

        this.groupedRecipes = Array.from(map.values());
        console.log(' Grouped recipes:', this.groupedRecipes);
      },
      error: (error) => console.error(' Error loading recipes:', error)
    });
  }
}
