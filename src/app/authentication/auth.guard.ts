import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);  
  const router = inject(Router);
  console.log("Utilisateur authentifié ?", authService.isAuthenticated());
  localStorage.setItem('lastVisitedPage', state.url);  
  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate([' ']);
    return false;
  }
};
