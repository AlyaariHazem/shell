import { Component } from '@angular/core';
import { SidebarComponent } from '../pages/sidebar/sidebar.component';
import { HeaderComponent } from '../pages/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LoadingBarRouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
