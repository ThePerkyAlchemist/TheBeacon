import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisplayStockListComponent } from './app/components/display-stock-list/display-stock-list.component';

const routes: Routes = [
  { path: '', component: DisplayStockListComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, HttpClientModule),
    provideRouter(routes)
  ]
});
