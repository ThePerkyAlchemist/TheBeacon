import { Component } from '@angular/core';
import { Drinkprofile } from '../../model/drinkprofile';

@Component({
  selector: 'app-drinkprofile',
  imports: [],
  templateUrl: './drinkprofile.component.html',
  styleUrl: './drinkprofile.component.css'
})
export class DrinkprofileComponent {
  drinkprofile?: Drinkprofile ={
  id : 1,
  recipeId : 1,
  description : 'Tasty!',
  sweetnessOrFrutitiness : 1 ,
  richness :1,
  booziness:1,
  sweetnessOrFrutitinessfreshness:1,
  lightness:1,
  timestamp: new Date
}
}
