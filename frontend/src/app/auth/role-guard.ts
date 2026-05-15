import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);

    const token = localStorage.getItem('token');

    if (!token) {
      router.navigate(['/login']);

      return false;
    }

    try {
      const decoded: any = jwtDecode(token);

      if (!roles.includes(decoded.role)) {
        router.navigate(['/login']);

        return false;
      }

      return true;
    } catch {
      router.navigate(['/login']);

      return false;
    }
  };
};
