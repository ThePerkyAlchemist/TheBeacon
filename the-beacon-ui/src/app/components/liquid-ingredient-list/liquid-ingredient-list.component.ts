import { Component, OnInit } from '@angular/core';
import { LiquidIngredientService } from '../../services/liquid-ingredient.service';
import { LiquidIngredient } from '../../model/liquidingredient';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSortModule, MatSort } from '@angular/material/sort';  // Table sorting
import { ViewChild } from '@angular/core'; // table polishing 

@Component({
  selector: 'app-liquid-ingredient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule],
  templateUrl: './liquid-ingredient-list.component.html',
  styleUrls: ['./liquid-ingredient-list.component.css']
})
export class LiquidIngredientListComponent implements OnInit {
  ingredients: LiquidIngredient[] = [];
  editingIngredient: LiquidIngredient | null = null;
  successMessage: string = ''; 
  dataSource = new MatTableDataSource<LiquidIngredient>();
  
  displayedColumns: string[] = [
    'name', 
    'category', 
    'subcategory', 
    'volume', 
    'units', 
    'status', 
    'barcode', 
    'expiry', 
    'actions'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: LiquidIngredientService) {}

  ngOnInit(): void {
    this.getAllIngredients();
  }

  // Talks to backend API
  getAllIngredients(): void {
    this.service.getAll().subscribe((data: LiquidIngredient[]) => {
      console.log('Fetched ingredients:', data);  // 👈 ADD THIS
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
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
        this.successMessage = 'Ingredient saved successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      });
    }
  }
  
  cancelEdit(): void {
    this.editingIngredient = null;
  }

  // The search box
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
