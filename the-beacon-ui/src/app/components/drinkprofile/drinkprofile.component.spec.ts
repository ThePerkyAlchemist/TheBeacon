import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkprofileComponent } from './drinkprofile.component';

describe('DrinkprofileComponent', () => {
  let component: DrinkprofileComponent;
  let fixture: ComponentFixture<DrinkprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
