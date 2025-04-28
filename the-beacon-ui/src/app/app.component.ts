import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayRecipeComponent } from './components/display-recipe/display-recipe.component';
import { LiquidIngredientListComponent } from './components/liquid-ingredient-list/liquid-ingredient-list.component';
import { DisplayDrinkProfileComponent } from './components/display-drinkprofile/display-drinkprofile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DisplayRecipeComponent, LiquidIngredientListComponent, DisplayDrinkProfileComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab: 'recipes' | 'ingredients' | 'drinkprofile'= 'recipes'; // this is tool bar
}

