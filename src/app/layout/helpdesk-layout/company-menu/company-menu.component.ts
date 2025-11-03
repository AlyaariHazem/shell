import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from 'app/core/services/app.layout.service';
import { AppMenuitemComponent } from '../app.menuitem.component';

type MenuItem = {
  label: string;
  icon?: string;
  routerLink?: any[];
  items?: MenuItem[];
  separator?: boolean;
  badge?: number | string;
  badgeSeverity?: 'primary'|'success'|'info'|'warn'|'danger';
  visible?: boolean;
};

@Component({
  selector: 'app-company-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, AppMenuitemComponent],
  templateUrl: './company-menu.component.html',
  styleUrls: ['./company-menu.component.scss']
})
export class CompanyMenuComponent implements OnInit {
  companyName = 'شركة التقنيات المتقدمة';
  companyLogo = 'assets/logo/company.svg'; // optional
  newApplicants = 89;
  activeJobs = 5;

  // menu
  model: MenuItem[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      { label: 'نظرة عامة',        icon: 'pi pi-book',       routerLink: ['/company/overview'] },
      { label: 'إدارة الوظائف',     icon: 'pi pi-briefcase',  routerLink: ['/company/jobs'] },
      { label: 'المتقدمون',         icon: 'pi pi-users',      routerLink: ['/company/applicants'],  badge: 12, badgeSeverity: 'danger' },
      { label: 'التحليلات',         icon: 'pi pi-chart-line', routerLink: ['/company/analytics'] },
      { label: 'الرسائل',           icon: 'pi pi-comment',    routerLink: ['/company/messages'],    badge: 3,  badgeSeverity: 'primary' },
      { label: 'ملف الشركة',        icon: 'pi pi-building',   routerLink: ['/company/profile'] },
      { label: 'الفواتير والدفع',   icon: 'pi pi-credit-card',routerLink: ['/company/billing'] },
      { label: 'الإعدادات',         icon: 'pi pi-cog',        routerLink: ['/company/settings'] },
    ];
  }
  updateCompanyProfile(){
    
  }
}
