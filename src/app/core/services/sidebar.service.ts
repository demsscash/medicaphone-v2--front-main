// src/app/core/services/sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsedSource = new BehaviorSubject<boolean>(false);
  sidebarCollapsed$ = this.sidebarCollapsedSource.asObservable();

  collapseSidebar() {
    this.sidebarCollapsedSource.next(true);
  }

  expandSidebar() {
    this.sidebarCollapsedSource.next(false);
  }
}