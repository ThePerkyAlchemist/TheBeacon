import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [RouterModule, MatTabsModule, HeaderComponent]
})
export class MainLayoutComponent {
  activeTabIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Set the active tab based on current route
    const path = window.location.pathname;
    if (path.includes('recipes')) this.activeTabIndex = 1;
    else if (path.includes('drinkprofiles')) this.activeTabIndex = 2;
    else if (path.includes('ingredients')) this.activeTabIndex = 3;
    else this.activeTabIndex = 0;
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    switch (index) {
      case 0:
        this.router.navigate(['/']);
        break;
      case 1:
        this.router.navigate(['/recipes']);
        break;
      case 2:
        this.router.navigate(['/drinkprofiles']);
        break;
      case 3:
        this.router.navigate(['/ingredients']);
        break;
    }
  }
}
