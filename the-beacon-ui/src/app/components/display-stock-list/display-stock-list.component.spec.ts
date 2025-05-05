import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayStockListComponent } from './display-stock-list.component';

describe('DisplayStockListComponent', () => {
  let component: DisplayStockListComponent;
  let fixture: ComponentFixture<DisplayStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayStockListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
