import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { PricingComponent } from './features/pricing/pricing.component';
import { authGuard } from './authentication/auth.guard';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pricing', component: PricingComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' },
];