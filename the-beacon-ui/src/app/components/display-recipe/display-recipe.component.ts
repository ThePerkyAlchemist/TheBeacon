import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// ... (imports for Angular Material og services uændret)

@Component({
  selector: 'app-display-recipe',
  templateUrl: './display-recipe.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class DisplayRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  dataSource = new MatTableDataSource<Recipe>();
  displayedColumns: string[] = ['id', 'name', 'ingredientId', 'volumeMl', 'actions'];

  successMessage: string = '';
  hideSuccess: boolean = false;

  showCreateForm: boolean = false; // <<<<< ADDED
  editingRecipe: Recipe | null = null;

  newRecipe: Recipe = {
    recipeId: 0,
    id: 0,
    name: '',
    ingredientId: 0,
    volumeMl: 0
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('createForm') createForm!: NgForm;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.dataSource = new MatTableDataSource<Recipe>(this.recipes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error loading recipes', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  startCreating(): void {
    this.showCreateForm = true;
    this.editingRecipe = null;
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newRecipe = {
      recipeId: 0,
      id: 0,
      name: '',
      ingredientId: 0,
      volumeMl: 0
    };
  }

  createRecipe(): void {
    if (this.createForm.valid) {
      this.recipeService.createRecipe(this.newRecipe).subscribe({
        next: () => {
          this.loadRecipes();
          this.successMessage = 'Recipe created successfully!';
          this.hideSuccess = false;
          this.cancelCreate(); // <<<<< RESET FORM AND HIDE
          setTimeout(() => this.hideSuccess = true, 3000);
        },
        error: (err) => console.error('Error creating recipe', err)
      });
    }
  }

  startEditing(recipe: Recipe): void {
    this.editingRecipe = { ...recipe };
    this.showCreateForm = false;
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
<<<<<<< HEAD
        error: (err) => console.error('Error updating recipe', err)
=======
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

          this.newRecipe = {
            recipeId: 0,
            id: 0,
            name: '',
            ingredientId: 0,
            volumeMl: 0
          };

          setTimeout(() => {
            this.createForm.resetForm();
          });

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
>>>>>>> 7efce1e (fixed pagniator on drinkprofile and refactored the setup to be simpler and comply to angular material)
      });
    }
  }

  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => this.loadRecipes(),
      error: (err) => console.error('Error deleting recipe', err)
    });
  }

  currentPage = 0;
  pageSize = 5;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
<<<<<<< HEAD
=======

  showCreateForm: boolean = false;

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newRecipe = {
      recipeId: 0,
      id: 0,
      name: '',
      ingredientId: 0,
      volumeMl: 0
    };
  }
>>>>>>> 7efce1e (fixed pagniator on drinkprofile and refactored the setup to be simpler and comply to angular material)
}
