// home.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isSidebarCollapsed = false;
  
  constructor(private sidebarService: SidebarService) {}
  
  ngOnInit() {
    this.sidebarService.sidebarCollapsed$.subscribe(collapsed => {
      this.isSidebarCollapsed = collapsed;
    });
  }
}