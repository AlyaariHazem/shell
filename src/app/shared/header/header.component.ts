import {
  ChangeDetectorRef,
  Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

import { User } from '../../core/services/user.service';
import { LogoutService } from 'app/core/services/logout.service';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [LogoutService, User],
})
export class HeaderComponent implements OnInit, OnDestroy {
  token = !!localStorage.getItem('access');

  // user dropdown (desktop)
  menuOpen = false;

  // mobile menu state
  mobileOpen = false;

  absoluteAvatar: string | null = null;
  firstName: string | null = null;

  private destroy$ = new Subject<void>();

  // refs
  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;
  @ViewChild('navbarEl', { static: false }) navbarEl?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private userService: User,
  ) {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const rel = data?.data?.user?.profile_picture;
        this.absoluteAvatar = this.toAbsolute(rel);
        this.firstName = data?.data?.user?.first_name;
      });

    // close mobile menu whenever we navigate
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  cdr = inject(ChangeDetectorRef);
  logoutService = inject(LogoutService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    window.addEventListener('storage', this.syncToken);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next(); this.destroy$.complete();
  }

  notImplemented(){
    this.messageService.add({ severity: 'info', summary: 'لم يتم التنفيذ', detail: 'هذه الميزة غير متوفرة حالياً' });
  }

  // ===== Desktop user menu =====
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    // close desktop user menu when clicking outside it
    if (this.menuRoot?.nativeElement && !this.menuRoot.nativeElement.contains(e.target as Node)) {
      this.closeMenu();
    }

    // close mobile menu if click outside navbar & toggle button
    if (this.mobileOpen) {
      const target = e.target as HTMLElement;
      const insideNavbar = target.closest('.navbar');
      const toggleBtn = target.closest('.mobile-menu-toggle');
      if (!insideNavbar && !toggleBtn) this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeMobileMenu(); this.closeMenu(); }

  private syncToken = (e: StorageEvent) => {
    if (e.key === 'access') this.token = !!e.newValue;
  };

  private toAbsolute(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  logout(): void {
    this.logoutService.logout().subscribe((res: any) => {
      this.token = false;
      this.messageService.add({ severity: 'success', summary: 'تسجيل الخروج', detail: res?.data?.message ?? 'تم تسجيل الخروج' });
      localStorage.removeItem('access');
      this.router.navigate(['/login']);
      this.cdr.detectChanges();
    });
  }

  // ===== Mobile menu =====
  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
    document.body.classList.toggle('no-scroll', this.mobileOpen);
  }

  closeMobileMenu(): void {
    if (this.mobileOpen) {
      this.mobileOpen = false;
      document.body.classList.remove('no-scroll');
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.mobileOpen) {
      this.closeMobileMenu();
    }
  }
}
