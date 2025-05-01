import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { IngredientService } from '../../services/ingredient.service';
import { Ingredient } from '../../model/ingredient';

@Component({
  selector: 'app-display-ingredient',
  templateUrl: './display-ingredient.component.html',
  styleUrls: ['./display-ingredient.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class DisplayIngredientComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'category', 'subCategory', 'barCodeString', 'alcPercentage', 'actions'];
  dataSource = new MatTableDataSource<Ingredient>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ingredientForm!: FormGroup;
  showForm = false;
  editingIngredient: Ingredient | null = null;

  constructor(
    private ingredientService: IngredientService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIngredients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      barCodeString: ['', Validators.required],
      alcPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  get nameControl() { return this.ingredientForm.get('name'); }
  get categoryControl() { return this.ingredientForm.get('category'); }
  get subCategoryControl() { return this.ingredientForm.get('subCategory'); }
  get barCodeStringControl() { return this.ingredientForm.get('barCodeString'); }
  get alcPercentageControl() { return this.ingredientForm.get('alcPercentage'); }

  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error loading ingredients', err)
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  startCreating(): void {
    this.ingredientForm.reset();
    this.editingIngredient = null;
    this.showForm = true;
  }

  startEditing(ingredient: Ingredient): void {
    this.editingIngredient = ingredient;
    this.ingredientForm.patchValue(ingredient);
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingIngredient = null;
    this.ingredientForm.reset();
  }

  saveIngredient(): void {
    if (this.ingredientForm.invalid) return;

    const formValue = this.ingredientForm.value;

    if (this.editingIngredient) {
      const updated: Ingredient = { ...formValue, id: this.editingIngredient.id };
      this.ingredientService.updateIngredient(updated).subscribe({
        next: () => {
          this.loadIngredients();
          this.cancelForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.ingredientService.createIngredient(formValue).subscribe({
        next: () => {
          this.loadIngredients();
          this.cancelForm();
        },
        error: (err) => console.error('Creation failed', err)
      });
    }
  }

  deleteIngredient(id: number): void {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;

    this.ingredientService.deleteIngredient(id).subscribe({
      next: () => this.loadIngredients(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}

