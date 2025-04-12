import { Component, OnInit } from '@angular/core';
import { LiquidIngredientService, LiquidIngredient } from '../../services/liquid-ingredient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liquid-ingredient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liquid-ingredient-list.component.html',
  styleUrls: ['./liquid-ingredient-list.component.css']
})
export class LiquidIngredientListComponent implements OnInit {
  ingredients: LiquidIngredient[] = [];
  editingIngredient: LiquidIngredient | null = null;

  constructor(private service: LiquidIngredientService) {}

  ngOnInit(): void {
    this.getAllIngredients();
  }

  getAllIngredients(): void {
    this.service.getAll().subscribe((data: LiquidIngredient[]) => {
      this.ingredients = data;
    });
  }

  editIngredient(ingredient: LiquidIngredient): void {
    this.editingIngredient = { ...ingredient }; // Gem en kopi til formular
  }
  
  addIngredient(): void {
    const newIngredient = { 
      name: 'New Ingredient',
      category: 'Category',
      subcategory: 'Subcategory',
      volumePerUnit: 700,
      numberOfUnits: 1,
      status: 'new',
      barcodeString: '',
      dateOfExpiry: new Date()
    };
  
    this.service.add(newIngredient).subscribe(() => {
      this.getAllIngredients();
    });
  }

  deleteIngredient(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.getAllIngredients();
    });
  }
  saveEdit(): void {
    if (this.editingIngredient) {
      this.service.update(this.editingIngredient).subscribe(() => {
        this.getAllIngredients();
        this.editingIngredient = null;
      });
    }
  }
  
  cancelEdit(): void {
    this.editingIngredient = null;
  }

}
