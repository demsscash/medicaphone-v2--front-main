import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './authentication/auth.guard';

import { PermissionGuard } from './core/guards/permission.guard';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { getPermissionsForRoute } from './core/config/menu-config';



export const routes: Routes = [
  { path: '', component: LoginComponent },

  
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' },
];
