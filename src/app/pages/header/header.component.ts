// src/app/layout/header/header.component.ts
import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['layout/home']),
    },
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
