import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Recipe } from  '../../model/recipe';
import { GroupedRecipe} from  '../../model/groupedrecipe';
import { RecipeService } from '../../services/recipe.service';
//it is black magic to me why this works

@Component({
  selector: 'app-display-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-recipe.component.html',
  styleUrls: ['./display-recipe.component.css']
})
//below was recommended as a quick fix, but I do not understand why
export class DisplayRecipeComponent implements OnInit {
  groupedRecipes: GroupedRecipe[] = [];
  recipe: any;

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.http.get<Recipe[]>('http://localhost:5146/api/recipe').subscribe({
      next: (data) => {
        const map = new Map<string, GroupedRecipe>();

        for (const r of data) {
          if (!map.has(r.name)) {
            map.set(r.name, {
              id: r.id,
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
  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.groupedRecipes = this.groupedRecipes.filter(r => r.id !== id);
        console.log('Trying to delete');
      },
      error: err => console.error('Error deleting recipe:', err)
    });
  }
  
  
}
