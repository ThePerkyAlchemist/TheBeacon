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
    MatInputModule, // For search bar
    MatFormFieldModule // search bar
  ],
})
export class DisplayRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  dataSource = new MatTableDataSource<Recipe>(); 
  successMessage: string = '';
  hideSuccess: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'ingredientId', 'volumeMl', 'actions'];

  editingRecipe: Recipe | null = null;
  currentPage = 0;
  pageSize = 5;

  newRecipe: Recipe = {
    recipeId: 0,
    id:0,
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

          // Reset model
          this.newRecipe = {
            recipeId:0,
            id: 0,
            name: '',
            ingredientId: 0,
            volumeMl: 0
          };

          // Reset form view
          setTimeout(() => {
            this.createForm.resetForm();
          });

          // Hide message after 3 sec
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
