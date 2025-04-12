import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { LiquidIngredientListComponent } from './app/components/liquid-ingredient-list/liquid-ingredient-list.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: LiquidIngredientListComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, HttpClientModule),
    provideRouter(routes)
  ]
});
