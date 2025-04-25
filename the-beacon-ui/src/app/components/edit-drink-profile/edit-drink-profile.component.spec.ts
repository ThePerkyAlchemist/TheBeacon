import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrinkProfileComponent } from './edit-drink-profile.component';

describe('EditDrinkProfileComponent', () => {
  let component: EditDrinkProfileComponent;
  let fixture: ComponentFixture<EditDrinkProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDrinkProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDrinkProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
