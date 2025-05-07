// Angular core imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Angular Material imports
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';

// App-specific models and services
import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';

@Component({
  selector: 'app-display-drinkprofile',
  templateUrl: './display-drinkprofile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule
  ]
})
export class DisplayDrinkProfileComponent implements OnInit {

  // Columns shown in the drink profile table
  displayedColumns: string[] = [
    'recipeId',
    'sweetness',
    'richness',
    'booziness',
    'sourness',
    'freshness',
    'lightness',
    'description',
    'actions'
  ];

  // Material table data source
  dataSource = new MatTableDataSource<DrinkProfile>();

  // Reference to the paginator from the template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // State: currently edited profile (null if creating)
  editingProfile: DrinkProfile | null = null;

  // Flag to show/hide creation form
  showCreateForm: boolean = false;

  // Template model for creating a new drink profile
  newProfile: DrinkProfile = {
    id: 0,
    recipeId: 0,
    description: '',
    sweetnessOrFruitiness: 0,
    richness: 0,
    booziness: 0,
    sourness: 0,
    freshness: 0,
    lightness: 0,
    timestamp: ''
  };

  constructor(private drinkProfileService: DrinkProfileService) {}

  // Lifecycle: load profiles once the component is initialized
  ngOnInit(): void {
    this.loadProfiles();
  }

  // Loads all drink profiles from the backend
  loadProfiles(): void {
    this.drinkProfileService.getDrinkProfiles().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Custom filtering logic to include all relevant fields
        this.dataSource.filterPredicate = (profile: DrinkProfile, filter: string) => {
          const lower = filter.trim().toLowerCase();
          // Combine relevant values into a single searchable string
          const combined = `
            ${profile.recipeId}
            ${profile.sweetnessOrFruitiness}
            ${profile.richness}
            ${profile.booziness}
            ${profile.sourness}
            ${profile.freshness}
            ${profile.lightness}
            ${profile.description ?? ''}
          `.toLowerCase();

          return combined.includes(lower);
        };
      },
      error: (err) => console.error('Error loading profiles', err)
    });
  }

  // Start the creation of a new profile
  startCreating(): void {
    this.showCreateForm = true;
    this.editingProfile = null;
  }

  // Cancel profile creation and reset state
  cancelCreate(): void {
    this.showCreateForm = false;

    this.newProfile = {
      id: 0,
      recipeId: 0,
      description: '',
      sweetnessOrFruitiness: 0,
      richness: 0,
      booziness: 0,
      sourness: 0,
      freshness: 0,
      lightness: 0,
      timestamp: ''
    };
  }

  // Begin editing an existing profile
  startEditing(profile: DrinkProfile): void {
    this.editingProfile = { ...profile };
    this.showCreateForm = false;
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingProfile = null;
  }

  // Save changes to an existing profile
  saveProfile(): void {
    if (this.editingProfile) {
      this.drinkProfileService.updateDrinkProfile(this.editingProfile.id, this.editingProfile).subscribe({
        next: () => {
          this.loadProfiles();
          this.editingProfile = null;
        },
        error: (err) => console.error('Error updating profile', err)
      });
    }
  }

  // Submit a new drink profile to the backend
  createProfile(): void {
    const profileToSend = {
      RecipeId: this.newProfile.recipeId,
      description: this.newProfile.description,
      sweetnessOrFruitiness: this.newProfile.sweetnessOrFruitiness,
      richness: this.newProfile.richness,
      booziness: this.newProfile.booziness,
      sourness: this.newProfile.sourness,
      freshness: this.newProfile.freshness,
      lightness: this.newProfile.lightness
    };

    this.drinkProfileService.createDrinkProfile(profileToSend).subscribe({
      next: () => {
        this.loadProfiles();
        this.cancelCreate();
      },
      error: (err) => console.error('Error creating profile', err)
    });
  }

  // Delete a drink profile by ID
  deleteProfile(id: number): void {
    this.drinkProfileService.deleteDrinkProfile(id).subscribe({
      next: () => this.loadProfiles(),
      error: (err) => console.error('Error deleting profile', err)
    });
  }

  // Apply user-typed filter to the data source
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
