import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { LiquidIngredientListComponent } from './components/display-stock-list/display-stock-list.component';
import { DisplayDrinkProfileComponent } from './components/display-drinkprofile/display-drinkprofile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplayRecipeComponent } from './components/display-recipe/display-recipe.component';
import { DisplayStockListComponent} from './components/display-stock-list/display-stock-list.component';
import { DisplayIngredientComponent} from './components/display-ingredient/display-ingredient.component';

// Header component
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatTabsModule,DisplayRecipeComponent,DisplayDrinkProfileComponent,DisplayStockListComponent, DisplayIngredientComponent, HeaderComponent],
})
export class AppComponent {
  // Optional: keep track of active tab index if needed (e.g., to restore state)
  activeTabIndex = 0;

  // You can use this method if you want to respond to tab changes
  onTabChange(event: any): void {
    this.activeTabIndex = event.index;

    // Optionally, perform logic when a specific tab is selected
    switch (this.activeTabIndex) {
      case 0:
        console.log('Recipes tab selected');
        break;
      case 1:
        console.log('Stock tab selected');
        break;
      case 2:
        console.log('Drink Profiles tab selected');
        break;

        case 3:
        console.log('Ingredient tab selected');
        break;
    }
  }
}
