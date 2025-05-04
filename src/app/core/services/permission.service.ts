import { Injectable } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  getPermissions(): string[] {
    const decodedToken = this.authService.decodeToken();
    return decodedToken?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) =>
      this.getPermissions().includes(permission)
    );
  }
  hasAllPermission(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  }
}
