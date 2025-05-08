import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Stock } from '../model/stock';

describe('StockService', () => {
  let service: StockService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockService]
    });

    service = TestBed.inject(StockService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all stock items', (done) => {
    const mockStocks: Stock[] = [{
      id: 1,
      category: 'Alcohol',
      subcategory: 'Vodka',
      name: 'Smirnoff',
      dateOfExpiry: '2025-12-31',
      volumePerUnit: 750,
      numberOfUnits: 10,
      status: 'Available',
      barcodeString: '9876543210987'
    }];

    service.getAll().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Smirnoff');
      done();
    });

    const req = httpMock.expectOne('http://localhost:5146/api/stock');
    expect(req.request.method).toBe('GET');
    req.flush(mockStocks);
  });
});
