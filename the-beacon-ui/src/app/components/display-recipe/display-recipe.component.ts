import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../model/recipe';
import { Ingredient } from '../../model/ingredient';
import { RecipeService } from '../../services/recipe.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';
import { IngredientService } from '../../services/ingredient.service';

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
  groupedDataSource = new MatTableDataSource<Recipe>();
  displayedColumns: string[] = ['id', 'name', 'ingredientId', 'volumeMl', 'actions'];
  groupedDisplayedColumns: string[] = ['name', 'ingredientName', 'volumeMl', 'actions'];

  successMessage: string = '';
  hideSuccess: boolean = false;

  showCreateForm: boolean = false; // <<<<< ADDED
  editingRecipe: Recipe | null = null;

  newRecipe: Recipe = {
    recipeId: 0,
    id: 0,
    name: '',
    ingredientId: 0,
    ingredientName: '',
    volumeMl: 0
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('createForm') createForm!: NgForm;

  constructor(
    private recipeService: RecipeService,
    private drinkProfileService: DrinkProfileService,
    private ingredientService: IngredientService
  ) { }

  ingredients: Ingredient[] = [];

  ngOnInit(): void {
    this.loadIngredients();
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



  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyGroupedFilter(filterValue: string): void {
    this.groupedDataSource.filter = filterValue.trim().toLowerCase();
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
      ingredientName: '',
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
    console.log('Editing recipe:', recipe);
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
        error: (err) => {
          console.error('Error updating recipe', err);
        }
      });
    }
  }



  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => this.loadRecipes(),
      error: (err) => {
        console.error('Error deleting recipe', err);
        alert("Cannot delete this recipe. It has associated drink profiles.");
      }
    });
  }
  

  currentPage = 0;
  pageSize = 5;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectedDrinkProfiles: DrinkProfile[] = [];

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

  //Grouped recipes
  groupedRecipes: {  name: string; ingredients: Recipe[] }[] = [];

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
    
    this.groupedRecipes= Array.from(groupedMap.entries()).map(([name, ingredients]) => ({
      name,
      ingredients
    }));
  }

  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.loadRecipes(); // ✅ load recipes only after ingredients are available
      },
      error: (err) => console.error('Error loading ingredients', err)
    });
  }
}
