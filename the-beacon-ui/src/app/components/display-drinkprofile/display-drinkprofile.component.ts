import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DrinkProfile } from '../../model/drinkprofile';
import { DrinkProfileService } from '../../services/drinkprofile.service';

@Component({
  selector: 'app-display-drinkprofile',
  templateUrl: './display-drinkprofile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class DisplayDrinkProfileComponent implements OnInit {
  profiles: DrinkProfile[] = [];
  editingProfile: DrinkProfile | null = null;
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
        this.profiles = data;
      },
      error: (err) => console.error('Error loading profiles', err)
    });
  }

  startEditing(profile: DrinkProfile): void {
    this.editingProfile = { ...profile };
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
          timestamp: '' // this will not be sent
        };
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
}
