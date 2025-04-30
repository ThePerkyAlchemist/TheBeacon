import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Ingredient } from '../../model/ingredient';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-display-ingredient',
  templateUrl: './display-ingredient.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class DisplayIngredientComponent implements OnInit {
  ingredients: Ingredient[] = [];
  editingIngredient: Ingredient | null = null;
  showCreateForm: boolean = false;

  displayedColumns: string[] = [
    'name',
    'category',
    'subcategory',
    'barcodeString',
    'alcPercentage',
    'actions'
  ];

  currentPage = 0;
  pageSize = 5;

  newIngredient: Ingredient = {
    id: 0,
    name: '',
    category: '',
    subcategory: '',
    barcodestring: '',
    alcpercentage: 0
  };

  constructor(private ingredientService: IngredientService) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getAll().subscribe({
      next: (data: Ingredient[]) => {
        this.ingredients = data;
      },
      error: (err) => console.error('Error loading ingredients', err)
    });
  }

  startCreating(): void {
    this.showCreateForm = true;
    this.editingIngredient = null;
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newIngredient = {
      id: 0,
      name: '',
      category: '',
      subcategory: '',
      barcodestring: '',
      alcpercentage: 0
    };
  }

  startEditing(ingredient: Ingredient): void {
    this.editingIngredient = { ...ingredient };
    this.showCreateForm = false;
  }

  cancelEdit(): void {
    this.editingIngredient = null;
  }

  saveIngredient(): void {
    if (this.editingIngredient) {
      this.ingredientService.update(this.editingIngredient).subscribe({
        next: () => {
          this.loadIngredients();
          this.editingIngredient = null;
        },
        error: (err) => console.error('Error updating ingredient', err)
      });
    }
  }

  createIngredient(): void {
    this.ingredientService.add(this.newIngredient).subscribe({
      next: () => {
        this.loadIngredients();
        this.cancelCreate();
      },
      error: (err) => console.error('Error creating ingredient', err)
    });
  }

  deleteIngredient(id: number): void {
    this.ingredientService.delete(id).subscribe({
      next: () => {
        this.loadIngredients();
      },
      error: (err) => console.error('Error deleting ingredient', err)
    });
  }

  get paginatedIngredients(): Ingredient[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.ingredients.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
