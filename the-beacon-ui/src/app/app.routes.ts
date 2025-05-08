import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { canActivateGuard } from './guards/auth.guard';
import { DisplayRecipeComponent } from './components/display-recipe/display-recipe.component';
import { DisplayIngredientComponent } from './components/display-ingredient/display-ingredient.component';
import { DisplayStockListComponent } from './components/display-stock-list/display-stock-list.component';
import { DisplayDrinkProfileComponent } from './components/display-drinkprofile/display-drinkprofile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Protected views
  { path: 'recipes', component: DisplayRecipeComponent, canActivate: [canActivateGuard] },
  { path: 'ingredients', component: DisplayIngredientComponent, canActivate: [canActivateGuard] },
  { path: 'stock', component: DisplayStockListComponent, canActivate: [canActivateGuard] },
  { path: 'drinkprofiles', component: DisplayDrinkProfileComponent, canActivate: [canActivateGuard] },

  // Catch-all
  { path: '**', redirectTo: 'login' }
];
