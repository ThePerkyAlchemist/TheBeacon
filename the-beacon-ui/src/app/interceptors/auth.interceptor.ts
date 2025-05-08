import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const headerValue = localStorage.getItem('headerValue');

    if (headerValue) {
      req = req.clone({
        setHeaders: {
          Authorization: headerValue
        }
      });
    }
  }

  return next(req);
};
