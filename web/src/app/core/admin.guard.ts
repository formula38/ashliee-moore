import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ashliee_token')) {
    return true;
  }
  return inject(Router).createUrlTree(['/admin/login']);
};
