import { Component } from '@angular/core';
import { SidebarComponent } from './helpdesk-layout/app.sidebar.component';

import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { SharedModule } from 'app/shared/shared.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LoadingBarRouterModule,SidebarComponent,SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
