// Angular core features
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Reactive form modules
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material components
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// App-specific model and service
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-display-recipe',
  standalone: true,
  templateUrl: './display-recipe.component.html',
  styleUrls: ['./display-recipe.component.css'],
  // Required modules for this standalone component
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DisplayRecipeComponent implements OnInit, AfterViewInit {
  // Data source for the Material table
  dataSource = new MatTableDataSource<Recipe>();

  // Table columns to be displayed
  displayedColumns: string[] = ['name', 'ingredientId', 'volumeMl', 'actions'];

  // ViewChild decorators to access MatSort and MatPaginator components
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Reactive form for creating or editing recipes
  recipeForm!: FormGroup;

  // Whether the form is currently shown
  showForm = false;

  // The recipe being edited, if any
  editingRecipe: Recipe | null = null;

  // Message shown after save actions
  successMessage = '';

  constructor(
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {}

  // On component initialization: set up form and fetch data
  ngOnInit(): void {
    this.initForm();
    this.loadRecipes();
  }

  // After view initialization: bind sorting and pagination
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Set up form controls with validation
  initForm(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredientId: [0, Validators.required],
      volumeMl: [0, Validators.required]
    });
  }

  // Load recipes from backend and populate table
  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error loading recipes', err)
    });
  }

  // Apply search filtering to the table
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Show the form for creating a new recipe
  startCreating(): void {
    this.recipeForm.reset();           // Clear existing form values
    this.editingRecipe = null;         // Ensure not editing
    this.showForm = true;              // Display the form
  }

  // Populate form with data for editing
  startEditing(recipe: Recipe): void {
    this.editingRecipe = recipe;       // Store recipe being edited
    this.recipeForm.patchValue(recipe); // Pre-fill form with existing values
    this.showForm = true;
  }

  // Cancel form actions and reset state
  cancelForm(): void {
    this.editingRecipe = null;
    this.showForm = false;
    this.recipeForm.reset();
  }

  // Submit form: either create or update based on editing mode
  saveRecipe(): void {
    if (this.recipeForm.invalid) return;

    const formValue = this.recipeForm.value;

    if (this.editingRecipe) {
      // Update existing recipe
      const updated: Recipe = { ...formValue, id: this.editingRecipe.id };
      this.recipeService.updateRecipe(updated.id, updated).subscribe({
        next: () => {
          this.loadRecipes();            // Refresh data
          this.cancelForm();             // Close form
          this.successMessage = 'Recipe updated!';
          setTimeout(() => this.successMessage = '', 3000); // Auto-hide message
        },
        error: (err) => console.error('Error updating recipe', err)
      });
    } else {
      // Create new recipe
      this.recipeService.createRecipe(formValue).subscribe({
        next: () => {
          this.loadRecipes();
          this.cancelForm();
          this.successMessage = 'New recipe added!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => console.error('Error creating recipe', err)
      });
    }
  }

  // Delete a recipe by ID with confirmation
  deleteRecipe(id: number): void {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    this.recipeService.deleteRecipe(id).subscribe({
      next: () => this.loadRecipes(),  // Refresh data after deletion
      error: (err) => console.error('Error deleting recipe', err)
    });
  }
}
