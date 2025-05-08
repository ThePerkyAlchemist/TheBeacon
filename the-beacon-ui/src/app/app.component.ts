import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';



// Angular Material Tabs module for tab navigation
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';

// Feature components used within the tabs
import { DisplayDrinkProfileComponent } from './components/display-drinkprofile/display-drinkprofile.component';
import { DisplayRecipeComponent } from './components/display-recipe/display-recipe.component';
import { DisplayStockListComponent } from './components/display-stock-list/display-stock-list.component';
import { DisplayIngredientComponent } from './components/display-ingredient/display-ingredient.component';

// Reusable header component
import { HeaderComponent } from './components/header/header.component';

//Authentication
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,

  // Import all the components and modules this standalone component depends on
  imports: [
    CommonModule,
    MatTabsModule,                  // Material tab group UI
    RouterOutlet,
    HeaderComponent
  ]
})
export class AppComponent {
  // Tracks which tab is currently active (used for logic if needed)
  activeTabIndex = 0;
  constructor(public auth: AuthService) {}
  
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

    /**
   * Event handler triggered when the user changes tabs.
   * Useful if you want to load data or run logic based on selected tab.
   * @param event MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;

    // Optional: log or handle tab-specific actions
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

