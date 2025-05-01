import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-display-stock-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './display-stock-list.component.html',
  styleUrls: ['./display-stock-list.component.css']
})
export class DisplayStockListComponent implements OnInit, AfterViewInit {
  stock: Stock[] = [];
  editingStock: Stock | null = null;
  successMessage: string = '';
  dataSource = new MatTableDataSource<Stock>();

  displayedColumns: string[] = [
    'name',
    'category',
    'subcategory',
    'volumePerUnit',
    'numberOfUnits',
    'status',
    'barcodeString',
    'dateOfExpiry',
    'actions'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentPage = 0;
  pageSize = 5;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getAllStock();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllStock(): void {
    this.stockService.getAll().subscribe({
      next: (data: Stock[]) => {
        this.dataSource.data = data;
      },
      error: err => {
        console.error('Error fetching stock:', err);
      }
    });
  }

  editStock(stockItem: Stock): void {
    this.editingStock = { ...stockItem };
  }

  addStock(): void {
    const newStock: Stock = {
      name: 'New Ingredient',
      category: 'Category',
      subcategory: 'Subcategory',
      volumePerUnit: 700,
      numberOfUnits: 1,
      status: 'new',
      barcodeString: '',
      dateOfExpiry: new Date().toISOString().split('T')[0],
      id: 0
    };

    this.stockService.add(newStock).subscribe(() => {
      this.getAllStock();
      this.currentPage = 0;
    });
  }

  deleteStock(id: number): void {
    this.stockService.delete(id).subscribe(() => {
      this.getAllStock();
    });
  }

  saveEdit(): void {
    if (this.editingStock) {
      this.stockService.update(this.editingStock).subscribe(() => {
        this.getAllStock();
        this.editingStock = null;
        this.successMessage = 'Stock item saved successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      });
    }
  }

  cancelEdit(): void {
    this.editingStock = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get dataLength(): number {
    return this.dataSource?.data?.length || 0;
  }
}
