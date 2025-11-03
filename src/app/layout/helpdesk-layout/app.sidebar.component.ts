import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService, MenuMode } from 'app/core/services/app.layout.service';
import { CompanyMenuComponent } from './company-menu/company-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CompanyMenuComponent],
  templateUrl: './app.sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  timeout: any = null;
  menuComponentType!: string;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
    private route: ActivatedRoute
  ) {
    this.menuComponentType = this.route.snapshot.data['menuComponentType'] ?? 'workflow';
  }

  ngOnInit(): void {}

  onMouseEnter() {
    if (!this.layoutService.state.anchored) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.state.sidebarActive = true;
    }
  }

  onMouseLeave() {
    if (!this.layoutService.state.anchored) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => (this.layoutService.state.sidebarActive = false), 300);
      }
    }
  }

  anchor() {
    this.layoutService.state.anchored = !this.layoutService.state.anchored;
  }

  toggleSidebar() {
    const menuMode: MenuMode = this.layoutService.isSlim() ? 'static' : 'slim';
    this.layoutService.config.menuMode = menuMode;
  }
}
