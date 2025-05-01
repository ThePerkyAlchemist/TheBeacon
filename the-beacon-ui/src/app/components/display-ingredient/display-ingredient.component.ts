// Angular core imports
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

// Reactive Forms imports
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material UI components
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
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
  selector: 'app-display-ingredient',
  templateUrl: './display-ingredient.component.html',
  styleUrls: ['./display-ingredient.component.css'],

  // Declare the component as standalone and import all necessary modules
  standalone: true,
  imports: [
    CommonModule,            // For Angular structural directives (*ngIf, etc.)
    ReactiveFormsModule,     // For form handling
    MatFormFieldModule,      // For <mat-form-field>
    MatInputModule,          // For <input matInput>
    MatTableModule,          // For <mat-table>
    MatPaginatorModule,      // For pagination
    MatIconModule,           // For <mat-icon>
    MatButtonModule          // For <button mat-raised-button>
  ]
})
export class DisplayIngredientComponent implements OnInit, AfterViewInit {

  // Column names for the material table
  displayedColumns: string[] = ['name', 'category', 'subCategory', 'barCodeString', 'alcPercentage', 'actions'];

  // Data source for the table
  dataSource = new MatTableDataSource<Ingredient>();

  // Paginator reference for Angular Material table
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Reactive form instance for creating/updating ingredients
  ingredientForm!: FormGroup;

  // Controls whether the form is visible
  showForm = false;

  // Holds the ingredient being edited (null if creating a new one)
  editingIngredient: Ingredient | null = null;

  constructor(
    private ingredientService: IngredientService, // Service for backend interaction
    private fb: FormBuilder                       // Used to build the form structure
  ) {}

  // Lifecycle hook: initialize form and load data
  ngOnInit(): void {
    this.initForm();
    this.loadIngredients();
  }

  // Lifecycle hook: set up table paginator after view loads
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Initializes the reactive form with controls and validation rules
  initForm(): void {
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      barCodeString: ['', Validators.required],
      alcPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  // Getter shortcuts to access form controls in the template
  get nameControl() { return this.ingredientForm.get('name'); }
  get categoryControl() { return this.ingredientForm.get('category'); }
  get subCategoryControl() { return this.ingredientForm.get('subCategory'); }
  get barCodeStringControl() { return this.ingredientForm.get('barCodeString'); }
  get alcPercentageControl() { return this.ingredientForm.get('alcPercentage'); }

  // Loads the list of ingredients from the backend
  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error loading ingredients', err)
    });
  }

  // Filters the ingredient table based on search input
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Prepares the form for creating a new ingredient
  startCreating(): void {
    this.ingredientForm.reset();
    this.editingIngredient = null;
    this.showForm = true;
  }

  // Pre-fills the form with data from the selected ingredient to edit
  startEditing(ingredient: Ingredient): void {
    this.editingIngredient = ingredient;
    this.ingredientForm.patchValue(ingredient);
    this.showForm = true;
  }

  // Cancels the form and resets the state
  cancelForm(): void {
    this.showForm = false;
    this.editingIngredient = null;
    this.ingredientForm.reset();
  }

  // Saves the form: determines if this is an edit or create operation
  saveIngredient(): void {
    if (this.ingredientForm.invalid) return;

    const formValue = this.ingredientForm.value;

    if (this.editingIngredient) {
      // Update existing ingredient
      const updated: Ingredient = { ...formValue, id: this.editingIngredient.id };
      this.ingredientService.updateIngredient(updated).subscribe({
        next: () => {
          this.loadIngredients();
          this.cancelForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      // Create new ingredient
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

    this.ingredientService.deleteIngredient(id).subscribe({
      next: () => this.loadIngredients(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}


