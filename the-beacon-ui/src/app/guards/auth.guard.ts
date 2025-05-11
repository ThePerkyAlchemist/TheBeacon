import { CanActivateFn } from '@angular/router';

export const canActivateGuard: CanActivateFn = () => {
  if (typeof window === 'undefined') {
    // SSR: skip auth guard or assume not authenticated
    return false;
  }

  const token = localStorage.getItem('headerValue');
  //console.log('AuthGuard check:', token);
  return !!token;
};
