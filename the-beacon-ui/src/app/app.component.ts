import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayRecipeComponent } from './components/display-recipe/display-recipe.component';
import { LiquidIngredientListComponent } from './components/liquid-ingredient-list/liquid-ingredient-list.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DisplayRecipeComponent, LiquidIngredientListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab: 'recipes' | 'ingredients' = 'recipes'; // this is the aktiv fane
}
