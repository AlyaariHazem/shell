// src/app/pages/cards-home/cards-home.component.ts
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-cards-home',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './cards-home.component.html',
  styleUrls: ['./cards-home.component.css'],
})
export class CardsHomeComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
