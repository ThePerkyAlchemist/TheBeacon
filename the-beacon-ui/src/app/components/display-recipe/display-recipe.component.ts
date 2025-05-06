// Angular core features
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Reactive form modules
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material components
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// App-specific model and service
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';

import { NgForm, FormsModule } from '@angular/forms';

// Imports from the other components
import { Ingredient } from '../../model/ingredient';
import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';
import { IngredientService } from '../../services/ingredient.service';


@Component({
  selector: 'app-display-recipe',
  standalone: true,
  templateUrl: './display-recipe.component.html',
  // Required modules for this standalone component
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class DisplayRecipeComponent implements OnInit, AfterViewInit {
  recipes: Recipe[] = [];
  // Data source for the Material table
  dataSource = new MatTableDataSource<Recipe>();
  // Table columns to be displayed
  groupedDataSource = new MatTableDataSource<Recipe>();
  displayedColumns: string[] = ['id', 'name', 'ingredientId', 'volumeMl', 'actions'];
  groupedDisplayedColumns: string[] = ['name', 'ingredientName', 'volumeMl', 'actions'];

  // Message shown after save actions
  successMessage: string = '';
  hideSuccess: boolean = false;

  // Whether the form is currently shown
  showCreateForm: boolean = false; // <<<<< ADDED
  editingRecipe: Recipe | null = null;

  recipeForm!: FormGroup;
  ingredients: Ingredient[] = [];
  selectedDrinkProfiles: DrinkProfile[] = [];

  currentPage = 0;
  pageSize = 5;

  groupedRecipes: { name: string; ingredients: Recipe[] }[] = [];

  // ViewChild decorators to access MatSort and MatPaginator components
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private recipeService: RecipeService,
    private drinkProfileService: DrinkProfileService,
    private ingredientService: IngredientService,
    private fb: FormBuilder 
  ) {}

  // On component initialization: set up form and fetch data
  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredientId: [0, Validators.required],
      volumeMl: [0, Validators.required]
    });

    this.loadIngredients();
    this.loadRecipes();
  }

  ngAfterViewInit(): void {
    // Re-assign paginator and sort to groupedDataSource after view init
    this.groupedDataSource.paginator = this.paginator;
    this.groupedDataSource.sort = this.sort;
  }
  /*
  The default filter only checks the stringified version of the whole object, which isn’t reliable unless all fields are strings. 
  A custom predicate allows you to define exactly which fields the filter should consider.

  A predicate is a function that returns either true or false based on a given condition.
  In the context of Angular Material's MatTableDataSource, the filterPredicate is a function used to decide whether a particular row should be visible when filtering is applied.
  If the function returns true, the row is included in the filtered results; if it returns false, it's excluded.
*/
loadRecipes(): void {
  this.recipeService.getRecipes().subscribe({
    next: (data) => {
      this.recipes = data;
      this.dataSource = new MatTableDataSource<Recipe>(this.recipes);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = (data: Recipe, filter: string) => {
        const lowerFilter = filter.trim().toLowerCase();
        return (
          data.name?.toLowerCase().includes(lowerFilter) ||
          data.ingredientName?.toLowerCase().includes(lowerFilter) ||
          data.ingredientId?.toString().includes(lowerFilter) ||
          data.volumeMl?.toString().includes(lowerFilter) ||
          data.id?.toString().includes(lowerFilter)
        );
      };

      const enriched = data.map(recipe => {
        const ingredient = this.ingredients.find(i => i.id === recipe.ingredientId);
        return {
          ...recipe,
          ingredientName: ingredient?.name || 'Unknown'
        };
      });

      this.groupedDataSource = new MatTableDataSource<Recipe>(enriched);
      this.groupedDataSource.sort = this.sort;
      this.groupedDataSource.paginator = this.paginator;

      this.groupedDataSource.filterPredicate = (data: Recipe, filter: string) => {
        const lowerFilter = filter.trim().toLowerCase();
        return (
          data.name?.toLowerCase().includes(lowerFilter) ||
          data.ingredientName?.toLowerCase().includes(lowerFilter) ||
          data.volumeMl?.toString().includes(lowerFilter)
        );
      };
    },
    error: (err) => console.error('Error loading recipes', err)
  });
}

// Filter for default and grouped tables
applyFilter(filterValue: string): void {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

applyGroupedFilter(filterValue: string): void {
  this.groupedDataSource.filter = filterValue.trim().toLowerCase();
}

// Show create form and reset state
startCreating(): void {
  this.showCreateForm = true;
  this.editingRecipe = null;

  this.recipeForm.reset({
    name: '',
    ingredientId: 0,
    volumeMl: 0
  });
}

// Hide form and clear fields
cancelCreate(): void {
  this.showCreateForm = false;
  this.recipeForm.reset();
}

// Submit new recipe (reactive form)
createRecipe(): void {
  if (this.recipeForm.valid) {
    const newRecipe = this.recipeForm.value;

    this.recipeService.createRecipe(newRecipe).subscribe({
      next: () => {
        this.loadRecipes();
        this.successMessage = 'Recipe created successfully!';
        this.hideSuccess = false;
        this.cancelCreate();
        setTimeout(() => this.hideSuccess = true, 3000);
      },
      error: (err) => console.error('Error creating recipe', err)
    });
  }
}

// Edit mode: load data into form
startEditing(recipe: Recipe): void {
  console.log('Editing recipe:', recipe);
  this.editingRecipe = { ...recipe };
  this.showCreateForm = false;

  this.recipeForm.patchValue({
    name: recipe.name,
    ingredientId: recipe.ingredientId,
    volumeMl: recipe.volumeMl
  });
}

// Cancel editing
cancelEdit(): void {
  this.editingRecipe = null;
}

// Save either a new or existing recipe
saveRecipe(): void {
  if (this.editingRecipe) {
    const updatedRecipe: Recipe = {
      ...this.editingRecipe,
      ...this.recipeForm.value
    };

    this.recipeService.updateRecipe(updatedRecipe.id, updatedRecipe).subscribe({
      next: () => {
        this.loadRecipes();
        this.successMessage = 'Recipe updated successfully!';
        this.hideSuccess = false;
        this.editingRecipe = null;
        setTimeout(() => this.hideSuccess = true, 3000);
      },
      error: (err) => {
        console.error('Error updating recipe', err);
      }
    });
  } else {
    this.createRecipe();
  }
}

// Delete recipe by ID
deleteRecipe(id: number): void {
  this.recipeService.deleteRecipe(id).subscribe({
    next: () => this.loadRecipes(),
    error: (err) => {
      console.error('Error deleting recipe', err);
      alert("Cannot delete this recipe. It has associated drink profiles.");
    }
  });
}

// Paginator handling
onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex;
  this.pageSize = event.pageSize;
}

// Load and show related drink profiles
viewDrinkProfile(recipeId: number): void {
  console.log('Fetching drink profiles for recipeId:', recipeId);
  this.drinkProfileService.getDrinkProfiles().subscribe({
    next: (profiles) => {
      const result = profiles.filter(p => p.recipeId === recipeId);
      console.log('Matching profiles:', result);
      this.selectedDrinkProfiles = result;
    },
    error: (err) => console.error('Error fetching drink profiles', err)
  });
}

// Group recipes by name for easier display
private groupByRecipeName(recipes: Recipe[]): void {
  this.groupedRecipes = [];

  const groupedMap = new Map<string, Recipe[]>();

  for (const recipe of recipes) {
    const ingredient = this.ingredients.find(i => i.id === recipe.ingredientId);
    const enriched: Recipe = {
      ...recipe,
      ingredientName: ingredient?.name || 'Unknown'
    };

    if (!groupedMap.has(recipe.name)) {
      groupedMap.set(recipe.name, []);
    }

    groupedMap.get(recipe.name)!.push(enriched);
    console.log(`[${recipe.name}] → ${ingredient?.name} (${recipe.volumeMl} ml)`);
  }

  this.groupedRecipes = Array.from(groupedMap.entries()).map(([name, ingredients]) => ({
    name,
    ingredients
  }));
}

// Load ingredients before loading recipes
loadIngredients(): void {
  this.ingredientService.getIngredients().subscribe({
    next: (data) => {
      this.ingredients = data;
      this.loadRecipes(); // Recipes depend on ingredient names
    },
    error: (err) => console.error('Error loading ingredients', err)
  });
}
}
