import { Component, OnInit } from '@angular/core';
import { LiquidIngredientService } from '../../services/liquid-ingredient.service';
import { LiquidIngredient } from '../../model/liquidingredient';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator'; //importing the paginator - this is done on all the components
import { PageEvent } from '@angular/material/paginator'; //importing the "event" that happens when the user interacts with the paginator

@Component({
  selector: 'app-liquid-ingredient-list',
  standalone: true,
  imports: [CommonModule, FormsModule,MatPaginatorModule],
  templateUrl: './liquid-ingredient-list.component.html',
  styleUrls: ['./liquid-ingredient-list.component.css']
})
export class LiquidIngredientListComponent implements OnInit {
  ingredients: LiquidIngredient[] = [];
  editingIngredient: LiquidIngredient | null = null;
  currentPage = 0; //Keeping track of what page the user are at
  pageSize = 5; //how many ingredients show on each page

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
      this.currentPage = 0; //method add
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
  /*adding a "getter" for the sliced list*/
  get paginatedIngredients(): LiquidIngredient[] {
    const start = this.currentPage * this.pageSize; 
    const end = start + this.pageSize;
    return this.ingredients.slice(start,end);
  }
 
//calling the method when the user interacts with the paginator and updating the pagenr and size
  onPageChange(event: PageEvent): void{
  
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
  }

}
