import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './app/components/login/login.component';
import { DisplayRecipeComponent } from './app/components/display-recipe/display-recipe.component';
import { DisplayStockListComponent } from './app/components/display-stock-list/display-stock-list.component';
import { DisplayDrinkProfileComponent } from './app/components/display-drinkprofile/display-drinkprofile.component';
import { DisplayIngredientComponent } from './app/components/display-ingredient/display-ingredient.component';
import { MainLayoutComponent } from './app/components/main-layout/main-layout.component';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { authGuard } from './app/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DisplayStockListComponent },
      { path: 'recipes', component: DisplayRecipeComponent },
      { path: 'drinkprofiles', component: DisplayDrinkProfileComponent },
      { path: 'ingredients', component: DisplayIngredientComponent }
    ]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes)
  ]
});
