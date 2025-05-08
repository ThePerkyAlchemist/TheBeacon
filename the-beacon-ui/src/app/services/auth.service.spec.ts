import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return header', (done) => {
    const mockResponse = { headerValue: 'Basic am9obi5kb2U6VmVyeVNlY3JldCE=' };

    service.authenticate('john.doe', 'VerySecret!').subscribe(login => {
      expect(login.headerValue).toBe(mockResponse.headerValue);
      done();
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'john.doe',
      password: 'VerySecret!'
    });

    req.flush(mockResponse);
  });
});
