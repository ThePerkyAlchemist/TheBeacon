// Angular core imports
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// App-specific models and services
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { Ingredient } from '../../model/ingredient';
import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-display-recipe',
  standalone: true,
  templateUrl: './display-recipe.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class DisplayRecipeComponent implements OnInit, AfterViewInit {
  // Table data
  recipes: Recipe[] = [];
  groupedDataSource = new MatTableDataSource<Recipe>();

  // Grouped and filtered recipes
  groupedRecipes: { name: string; recipeId: number; ingredients: Recipe[] }[] = [];
  filteredGroupedRecipes: { name: string; recipeId: number; ingredients: Recipe[] }[] = [];

  // Columns to be displayed in the table
  groupedDisplayedColumns: string[] = ['name', 'ingredientName', 'volumeMl', 'actions'];

  // Reactive form and form state
  recipeForm!: FormGroup;
  showForm = false;
  editingRecipe: Recipe | null = null;

  // Supplementary data
  ingredients: Ingredient[] = [];
  selectedDrinkProfiles: DrinkProfile[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 5;

  // Success feedback
  successMessage: string = '';
  hideSuccess: boolean = false;

  // View references
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private drinkProfileService: DrinkProfileService
  ) {}

  // Recipe grouping helper
  groupRecipes(recipes: Recipe[]): {
    name: string;
    recipeId: number;
    ingredients: Recipe[];
  }[] {
    const grouped: { [key: string]: { name: string; recipeId: number; ingredients: Recipe[] } } = {};

    for (const r of recipes) {
      if (!grouped[r.name]) {
        grouped[r.name] = { name: r.name, recipeId: r.recipeId || r.id, ingredients: [] };
      }
      grouped[r.name].ingredients.push(r);
    }

    return Object.values(grouped);
  }

  // Derived paginated slice
  get paginatedRecipes() {
    const start = this.currentPage * this.pageSize;
    return this.filteredGroupedRecipes.slice(start, start + this.pageSize);
  }

  // Initialize form and load data
  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredientId: [0, Validators.required],
      volumeMl: [0, Validators.required]
    });
    this.loadIngredients(); // Load ingredients first
  }

  // Hook to connect paginator and sorter
  ngAfterViewInit(): void {
    this.groupedDataSource.paginator = this.paginator;
    this.groupedDataSource.sort = this.sort;
  }

  // Load ingredients and then recipes
  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.loadRecipes();
      },
      error: (err) => console.error('Error loading ingredients', err)
    });
  }

  // Load recipes and enrich with ingredient names
  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        const enriched = data.map(recipe => {
          const ingredient = this.ingredients.find(i => i.id === recipe.ingredientId);
          return { ...recipe, ingredientName: ingredient?.name || 'Unknown' };
        });

        this.groupedRecipes = this.groupRecipes(enriched);
        this.filteredGroupedRecipes = this.groupedRecipes;

        // Optional: retain MatTableDataSource support
        this.groupedDataSource = new MatTableDataSource<Recipe>(enriched);
        this.groupedDataSource.sort = this.sort;
        this.groupedDataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error loading recipes', err)
    });
  }

  // Apply search filter
  applyGroupedFilter(value: string): void {
    const lower = value.trim().toLowerCase();
    this.filteredGroupedRecipes = this.groupedRecipes.filter(group =>
      group.name.toLowerCase().includes(lower) ||
      group.ingredients.some(i =>
        i.ingredientName.toLowerCase().includes(lower) ||
        i.volumeMl.toString().includes(lower)
      )
    );
    this.currentPage = 0;
  }

  // Handle page changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  // Start create mode
  startCreating(): void {
    this.recipeForm.reset({
      name: '',
      ingredientId: 0,
      volumeMl: 0
    });
    this.editingRecipe = null;
    this.showForm = true;
  }

  // Start edit mode with recipe data
  startEditing(recipe: Recipe): void {
    this.recipeForm.patchValue({
      name: recipe.name,
      ingredientId: recipe.ingredientId,
      volumeMl: recipe.volumeMl
    });
    this.editingRecipe = recipe;
    this.showForm = true;
  }

  // Cancel form and reset state
  cancelForm(): void {
    this.recipeForm.reset({
      name: '',
      ingredientId: 0,
      volumeMl: 0
    });
    this.editingRecipe = null;
    this.showForm = false;
  }

  // Save a new or updated recipe
  saveRecipe(): void {
    if (this.recipeForm.invalid) return;

    const formValue = this.recipeForm.value;

    if (this.editingRecipe) {
      const updated: Recipe = { ...this.editingRecipe, ...formValue };
      this.recipeService.updateRecipe(updated.id, updated).subscribe({
        next: () => {
          this.loadRecipes();
          this.successMessage = 'Recipe updated successfully!';
          this.hideSuccess = false;
          this.cancelForm();
          setTimeout(() => this.hideSuccess = true, 3000);
        },
        error: (err) => console.error('Error updating recipe', err)
      });
    } else {
      this.recipeService.createRecipe(formValue).subscribe({
        next: () => {
          this.loadRecipes();
          this.successMessage = 'Recipe created successfully!';
          this.hideSuccess = false;
          this.cancelForm();
          setTimeout(() => this.hideSuccess = true, 3000);
        },
        error: (err) => console.error('Error creating recipe', err)
      });
    }
  }

  // Delete recipe by ID
  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => this.loadRecipes(),
      error: (err) => {
        console.error('Error deleting recipe', err);
        alert('Cannot delete this recipe. It has associated drink profiles.');
      }
    });
  }

  // Load drink profiles related to a recipe
  viewDrinkProfile(recipeId: number): void {
    this.drinkProfileService.getDrinkProfiles().subscribe({
      next: (profiles) => {
        this.selectedDrinkProfiles = profiles.filter(p => p.recipeId === recipeId);
      },
      error: (err) => console.error('Error fetching drink profiles', err)
    });
  }
}
