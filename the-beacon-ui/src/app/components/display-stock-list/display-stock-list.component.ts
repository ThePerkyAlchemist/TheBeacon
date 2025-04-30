import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Stock } from '../../model/stock';
import { StockService } from '../../services/stock.service'; // Husk at denne skal eksistere

@Component({
  selector: 'app-display-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './display-stock-list.component.html',
  styleUrls: ['./display-stock-list.component.css']
})
export class DisplayStockListComponent implements OnInit {
  stock: Stock[] = [];
  editingStock: Stock | null = null;
  successMessage: string = '';
  dataSource = new MatTableDataSource<Stock>();

  displayedColumns: string[] = [
    'name',
    'category',
    'subcategory',
    'volume',
    'units',
    'status',
    'barcode',
    'expiry',
    'actions'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  currentPage = 0;
  pageSize = 5;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getAllStock();
  }

  getAllStock(): void {
    this.stockService.getAll().subscribe((data: Stock[]) => {
      console.log('Fetched stock:', data);
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
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
      dateOfExpiry: new Date().toISOString().split('T')[0], // hvis din backend bruger string format
      id: 0 // placeholder, backend bør autogenerere
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
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
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
