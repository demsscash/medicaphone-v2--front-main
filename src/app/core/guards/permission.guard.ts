import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(route: any): boolean {
    const requiredPermissions = route.data?.['permissions'] as string[];
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    if (this.permissionService.hasAnyPermission(requiredPermissions)) {
      return true;
    }

    this.router.navigate(['/access-denied']);
    return false;
  }
}