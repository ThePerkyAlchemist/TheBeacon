import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authHeader = localStorage.getItem("headerValue");
  console.log(`[Interceptor] Sending request to ${req.url} with authHeader: ${authHeader}`);

  const authReq = authHeader
    ? req.clone({ setHeaders: { Authorization: authHeader } })
    : req;

  return next(authReq);
};
