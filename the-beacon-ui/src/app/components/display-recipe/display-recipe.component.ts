import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../model/recipe';
import { GroupedRecipe } from '../../model/groupedrecipe';
import { RecipeService } from '../../services/recipe.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSortModule, MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-display-recipe',
  templateUrl: './display-recipe.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatTableModule, MatSortModule] 
})
export class DisplayRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  dataSource = new MatTableDataSource<Recipe>(); 
  successMessage: string = '';
  hideSuccess: boolean = false;
  displayedColumns: string[] = ['recipeId', 'name', 'liquidId', 'volume', 'actions']; 

  editingRecipe: Recipe | null = null;
  newRecipe: Recipe = {
    id: 0, recipeId: 0, name: '', liquidId: 0, liquidIngredientVolumeMl: 0, liquidName: ''
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('createForm') createForm!: NgForm;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.dataSource.data = data;  // bind to datasource
        this.dataSource.sort = this.sort; // enable sorting
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
    if (this.createForm.valid) {
      this.recipeService.createRecipe(this.newRecipe).subscribe({
        next: () => {
          this.loadRecipes();
          this.successMessage = 'Recipe created successfully!';
          this.hideSuccess = false;
          
          // 1. Reset the model FIRST
        this.newRecipe = {
          id: 0,
          recipeId: 0,
          name: '',
          liquidId: 0,
          liquidIngredientVolumeMl: 0,
          liquidName: ''
        };

        // THEN reset the form AFTER a short delay
        setTimeout(() => {
          this.createForm.resetForm({
            recipeId: '',
            name: '',
            liquidId: '',
            liquidIngredientVolumeMl: '',
            liquidName: ''
          });
        });


          // Fade away success message
          setTimeout(() => {
            this.hideSuccess = true;
            setTimeout(() => {
              this.successMessage = '';
            }, 1000);
          }, 3000);
        },
        error: (err) => {
          console.error('Error creating recipe', err);
        }
      });
    }
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
}
