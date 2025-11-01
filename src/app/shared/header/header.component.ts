import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

import { UserProfileService } from '../../core/services/user.service';
// Use the environment that Angular CLI replaces for prod/dev
import { environment } from 'environments/environment';
import { AuthAPIService } from 'app/pages/auth/auth-api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/pages/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], // ✅ correct property name (plural)
  providers: [AuthAPIService, UserProfileService],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Services (via `inject` for tree-shakable providers)
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authApiService = inject(AuthAPIService);
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserProfileService);
  readonly authService = inject(AuthService);

  // UI state
  menuOpen = false;          // desktop user dropdown
  mobileOpen = false;        // mobile menu state

  absoluteAvatar: string | null = null;
  firstName: string | null = null;

  // simple flag for template bindings (derived from token presence)
  isAuthenticated = false;

  // refs
  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;
  @ViewChild('navbarEl', { static: false }) navbarEl?: ElementRef<HTMLElement>;

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // initialize auth flag at startup
    this.isAuthenticated = this.authService.isLoggedIn();

    // keep auth flag in sync across tabs
    window.addEventListener('storage', this.syncToken);

    // subscribe to user stream only if logged in
    if (this.isAuthenticated) {
      this.userService.user$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          const rel = data?.data?.user?.profile_picture;
          this.absoluteAvatar = this.toAbsolute(rel);
          this.firstName = data?.data?.user?.first_name ?? null;
          this.cdr.markForCheck();
        });
    }

    // close mobile menu on every navigation
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.closeMobileMenu());
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next();
    this.destroy$.complete();
  }

  notImplemented() {
    this.messageService.add({
      severity: 'info',
      summary: 'لم يتم التنفيذ',
      detail: 'هذه الميزة غير متوفرة حالياً'
    });
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
      const insideNavbar = !!target.closest('.navbar');
      const toggleBtn = !!target.closest('.mobile-menu-toggle');
      if (!insideNavbar && !toggleBtn) this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeMobileMenu(); this.closeMenu(); }

  // keep isAuthenticated in sync across tabs/windows
  private syncToken = (e: StorageEvent) => {
    if (e.storageArea !== localStorage) return;
    if (e.key === 'access') {
      this.isAuthenticated = !!e.newValue;
      this.cdr.markForCheck();
    }
  };

  private toAbsolute(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  logout(): void {
    // Call API; on success, clear local session and notify
    this.authApiService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.authService.clear();
          this.isAuthenticated = false;
          this.messageService.add({
            severity: 'success',
            summary: 'تسجيل الخروج',
            detail: res?.data?.message ?? 'تم تسجيل الخروج'
          });
          // Optional: navigate to login/home
          this.router.navigateByUrl('/auth/login').catch(() => {});
        },
        error: () => {
          // even if server fails, ensure local logout
          this.authService.clear();
          this.isAuthenticated = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'تسجيل الخروج',
            detail: 'تم إنهاء الجلسة محلياً'
          });
          this.router.navigateByUrl('/auth/login').catch(() => {});
        }
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
    if (window.innerWidth > 768 && this.mobileOpen) this.closeMobileMenu();
  }
}
