import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; // Added for Angular Material data table
import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

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
    MatTableModule
  ]
})
export class DisplayDrinkProfileComponent implements OnInit {
  // profiles: DrinkProfile[] = []; // Replaced by MatTableDataSource below
  editingProfile: DrinkProfile | null = null;
  showCreateForm: boolean = false;

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

  // drinkProfiles: DrinkProfile[] = []; // Not needed with MatTableDataSource
  // currentPage = 0; // Replaced by MatPaginator
  // pageSize = 5;     // Replaced by MatPaginator

  dataSource = new MatTableDataSource<DrinkProfile>(); // ✅ Used by the mat-table

  @ViewChild(MatPaginator) paginator!: MatPaginator; // ✅ Link the table to the paginator

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

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.drinkProfileService.getDrinkProfiles().subscribe({
      next: (data) => {
        this.dataSource.data = data; // Set table data source
        this.dataSource.paginator = this.paginator; // Enable pagination
      },
      error: (err) => console.error('Error loading profiles', err)
    });
  }

  startCreating(): void {
    this.showCreateForm = true;
    this.editingProfile = null;
  }

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

  startEditing(profile: DrinkProfile): void {
    this.editingProfile = { ...profile };
    this.showCreateForm = false;
  }

  cancelEdit(): void {
    this.editingProfile = null;
  }

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

  deleteProfile(id: number): void {
    this.drinkProfileService.deleteDrinkProfile(id).subscribe({
      next: () => {
        this.loadProfiles();
      },
      error: (err) => console.error('Error deleting profile', err)
    });
  }

//not needed with mat paginator strucutre above:
  // get paginatedDrinkProfiles(): DrinkProfile[] {
  //   const start = this.currentPage * this.pageSize;
  //   const end = start + this.pageSize;
  //   return this.drinkProfiles.slice(start, end);
  // }

  // onPageChange(event: PageEvent): void {
  //   this.currentPage = event.pageIndex;
  //   this.pageSize = event.pageSize;
  // }
}