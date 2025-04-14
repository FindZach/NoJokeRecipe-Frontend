
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url }
  });
  return false;
};

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
