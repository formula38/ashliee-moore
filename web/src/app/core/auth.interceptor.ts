import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('ashliee_token') : null;
  if (token && req.url.includes('/api/v1/admin/') && !req.url.endsWith('/login')) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
