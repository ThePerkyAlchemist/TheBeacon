// Angular core imports
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

// Form modules for reactive form handling
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular common directives (e.g. *ngIf, *ngFor)
import { CommonModule } from '@angular/common';

// Angular Material UI modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Model and service for Stock
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-display-stock-list',
  standalone: true,
  templateUrl: './display-stock-list.component.html',
  styleUrls: ['./display-stock-list.component.css'],
  // Declare necessary Angular and Material modules for this standalone component
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DisplayStockListComponent implements OnInit, AfterViewInit {

  // Table data source and displayed columns
  dataSource = new MatTableDataSource<Stock>();
  displayedColumns: string[] = [
    'name', 'category', 'subcategory', 'volumePerUnit', 'numberOfUnits',
    'status', 'barcodeString', 'dateOfExpiry', 'actions'
  ];

  // Table sorting and pagination
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Reactive form instance
  stockForm!: FormGroup;

  // Controls whether the stock form is visible
  showForm = false;

  // Holds the current stock being edited (or null if creating a new one)
  editingStock: Stock | null = null;

  // Optional success message (e.g. after saving)
  successMessage = '';

  constructor(
    private stockService: StockService,   // Service for API communication
    private fb: FormBuilder               // Used to create and manage form controls
  ) {}

  // Initialize form and load table data on component mount
  ngOnInit(): void {
    this.initForm();
    this.loadStock();
  }

  // Setup paginator and sorting after view is fully initialized
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Initialize form controls with validators
  initForm(): void {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      volumePerUnit: [0, Validators.min(1)],
      numberOfUnits: [0, Validators.min(1)],
      status: ['', Validators.required],
      barcodeString: [''],
      dateOfExpiry: ['']
    });
  }

  // Shortcut for name input field (used in HTML validation)
  get nameControl() {
    return this.stockForm.get('name');
  }

  // Load stock data from the backend and populate the table
  loadStock(): void {
    this.stockService.getAll().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error loading stock', err)
    });
  }

  // Filter function triggered by the search bar
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Start creation of new stock: reset form and show it
  startCreating(): void {
    this.stockForm.reset();
    this.editingStock = null;
    this.showForm = true;
  }

  // Start editing: populate form with selected stock's values
  startEditing(stock: Stock): void {
    this.editingStock = stock;
    this.stockForm.patchValue(stock);
    this.showForm = true;
  }

  // Cancel form (both edit and create): hide and reset
  cancelForm(): void {
    this.editingStock = null;
    this.showForm = false;
    this.stockForm.reset();
  }

  // Save the form (handles both create and update logic)
  saveStock(): void {
    if (this.stockForm.invalid) return;

    const formValue = this.stockForm.value;

    if (this.editingStock) {
      // Update existing stock
      const updated: Stock = { ...formValue, id: this.editingStock.id };
      this.stockService.update(updated).subscribe({
        next: () => {
          this.loadStock();
          this.cancelForm();
          this.successMessage = 'Stock updated!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => console.error('Error updating stock', err)
      });
    } else {
      // Create new stock
      this.stockService.add(formValue).subscribe({
        next: () => {
          this.loadStock();
          this.cancelForm();
          this.successMessage = 'New stock item added!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => console.error('Error creating stock', err)
      });
    }
  }

  // Delete stock by ID after confirmation
  deleteStock(id: number): void {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.stockService.delete(id).subscribe({
      next: () => this.loadStock(),
      error: (err) => console.error('Error deleting stock', err)
    });
  }

  // Getter for total data length (used in paginator)
  get dataLength(): number {
    return this.dataSource.data.length;
  }
}
