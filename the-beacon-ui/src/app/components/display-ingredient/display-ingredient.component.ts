// Angular core imports
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

// Reactive Forms imports
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material UI components
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort'; // The sorting function
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Common directives like *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Local application services and models
import { IngredientService } from '../../services/ingredient.service';
import { Ingredient } from '../../model/ingredient';

@Component({
  selector: 'app-display-ingredient', //custom html name-tag to be used anywhere in the app
  templateUrl: './display-ingredient.component.html', //where to find the components html
  styleUrls: ['./display-ingredient.component.css'], //where to find the components css

  // Declare the component as standalone and import all necessary modules
  standalone: true, //manages own dependencies and doensnt rely on parent
  imports: [
    CommonModule,            // For Angular structural directives (*ngIf, etc.)
    ReactiveFormsModule,     // For form handling
    MatFormFieldModule,      // For <mat-form-field>
    MatInputModule,          // For <input matInput>
    MatTableModule,          // For <mat-table>
    MatPaginatorModule,      // For pagination
    MatSortModule,           // For sorting in the headers of the table
    MatIconModule,           // For <mat-icon>
    MatButtonModule          // For <button mat-raised-button>
  ]
})
//defining the component class:
export class DisplayIngredientComponent implements OnInit, AfterViewInit {

  // Column names for the material table + the order it is shown
  displayedColumns: string[] = ['id','name', 'category', 'subCategory', 'barCodeString', 'alcPercentage', 'actions'];

  // Data source for the table
  dataSource = new MatTableDataSource<Ingredient>(); //holds the ingredient data

  // Paginator reference for Angular Material table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // <-- ViewChild for MatSort

  // Reactive form instance for creating/updating ingredients
  ingredientForm!: FormGroup;

  // Controls whether the form is visible
  showForm = false;

  // Holds the ingredient being edited (null if creating a new one)
  editingIngredient: Ingredient | null = null; //stores the ingredient being edited

  constructor(
    private ingredientService: IngredientService, // Service for backend interaction - talks to the backend through service
    private fb: FormBuilder                       // Used to build the form structure
  ) {}

  // Lifecycle hook: initialize form and load data
  ngOnInit(): void {
    this.initForm();          //build the form
    this.loadIngredients();   //get data from backend
  }

  // Lifecycle hook: set up table paginator after view loads + assign sort
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // <-- Assign sort
  }

  // Initializes the reactive form with controls and validation rules eg. alc percentage
  initForm(): void {
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      barCodeString: ['', Validators.required],
      alcPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  // Getter shortcuts (e.g. instead of writing ingredientForm.get(name) we can write nameControl):
  get idControl() { return this.ingredientForm.get('id'); }
  get nameControl() { return this.ingredientForm.get('name'); }
  get categoryControl() { return this.ingredientForm.get('category'); }
  get subCategoryControl() { return this.ingredientForm.get('subCategory'); }
  get barCodeStringControl() { return this.ingredientForm.get('barCodeString'); }
  get alcPercentageControl() { return this.ingredientForm.get('alcPercentage'); }

  // Loads the list of ingredients from the backend via services
  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => this.dataSource.data = data,  //if succesfull data is inserted into the datasource
      error: (err) => console.error('Error loading ingredients', err)
    });
  }

  // Filters the ingredient table based on search input
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase(); //trim removing spaces and toLowerCase makes searching case-insentitive
  }

  // Prepares the form for creating a new ingredient
  startCreating(): void {
    this.ingredientForm.reset(); //reset - clean empty form
    this.editingIngredient = null; //not editing, thus creating
    this.showForm = true; //show the form on the screen
  }

  // Showing the form and pre-fills it with data from the selected ingredient to edit
  startEditing(ingredient: Ingredient): void {
    this.editingIngredient = ingredient;
    this.ingredientForm.patchValue(ingredient);
    this.showForm = true;
  }

  // Cancels the form and resets the state
  cancelForm(): void {
    this.showForm = false; //closing the form
    this.editingIngredient = null; //not editing
    this.ingredientForm.reset(); //resetting the form for next time
  }

  // Saves the form: determines if this is an edit or create operation
  saveIngredient(): void {
    if (this.ingredientForm.invalid) return; //does nothing if form is not valid

    const formValue = this.ingredientForm.value;

    if (this.editingIngredient) {
      // Update existing ingredient
      const updated: Ingredient = { ...formValue, id: this.editingIngredient.id };
      this.ingredientService.updateIngredient(updated).subscribe({ //calls backend to update the ingredient
        next: () => {
          this.loadIngredients();
          this.cancelForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create new ingredient - load updated ingredient list - and cancel form
      this.ingredientService.createIngredient(formValue).subscribe({
        next: () => {
          this.loadIngredients();
          this.cancelForm();
        },
        error: (err) => console.error('Creation failed', err)
      });
    }
  }

  // Deletes an ingredient after confirmation
  deleteIngredient(id: number): void {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;

    this.ingredientService.deleteIngredient(id).subscribe({ //if confirmed by user, call backend and delete ingredient via services
      next: () => this.loadIngredients(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}


