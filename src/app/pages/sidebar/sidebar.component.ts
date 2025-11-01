import { Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private router: Router) {}

  private doc = inject(DOCUMENT);
  collapsed = false;

  ngOnInit() {
    this.doc.documentElement.style.setProperty('--sidebar-w', '280px'); // initial width
  }

  toggle() {
    this.collapsed = !this.collapsed;
    this.doc.documentElement.style.setProperty(
      '--sidebar-w',
      this.collapsed ? '72px' : '280px'
    );
  }

  items = [
    {
      label: 'Products',
      icon: 'pi pi-shopping-bag',
      command: () => this.router.navigate(['layout/products']),
    },
    {
      label: 'Cart',
      icon: 'pi pi-shopping-cart',
      command: () => this.router.navigate(['layout/cart']),
    },
  ];
}
