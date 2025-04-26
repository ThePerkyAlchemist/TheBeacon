import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from  '../../model/recipe';
import { GroupedRecipe} from  '../../model/groupedrecipe';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-display-recipe',
  templateUrl: './display-recipe.component.html',
  standalone: true, 
  imports: [CommonModule, FormsModule, HttpClientModule] 
})
export class DisplayRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  editingRecipe: Recipe | null = null;
  newRecipe: Recipe = {
    id: 0, recipeId: 0, name: '', liquidId: 0, liquidIngredientVolumeMl: 0, liquidName: ''
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => {
        console.error('Error loading recipes', err);
      }
    });
  }

  startEditing(recipe: Recipe): void {
    this.editingRecipe = { ...recipe };
  }

  cancelEdit(): void {
    this.editingRecipe = null;
  }

  saveRecipe(): void {
    if (this.editingRecipe) {
      this.recipeService.updateRecipe(this.editingRecipe.id, this.editingRecipe).subscribe({
        next: () => {
          this.loadRecipes();
          this.editingRecipe = null;
        },
        error: (err) => {
          console.error('Error updating recipe', err);
        }
      });
    }
  }

  createRecipe(): void {
    this.recipeService.createRecipe(this.newRecipe).subscribe({
      next: () => {
        this.loadRecipes();
        this.newRecipe = { id: 0, recipeId: 0, name: '', liquidId: 0, liquidIngredientVolumeMl: 0, liquidName: '' };
      },
      error: (err) => {
        console.error('Error creating recipe', err);
      }
    });
  }

  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.loadRecipes();
      },
      error: (err) => {
        console.error('Error deleting recipe', err);
      }
    });
  }
}