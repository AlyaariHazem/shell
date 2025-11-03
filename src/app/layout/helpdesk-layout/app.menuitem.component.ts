import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { MenuService } from './app.menu.service';
import { LayoutService } from 'app/core/services/app.layout.service';
import { SidebarComponent } from './app.sidebar.component';

@Component({
  // attribute selector as in your templates
  selector: '[app-menuitem]',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
  template: `
  <ng-container>
    <!-- <div *ngIf="root && item.visible !== false && item.visibleRoot !== false" class="layout-menuitem-root-text">
      {{ item.label  ? item.label : translatePath }}
    </div> -->

    <!-- link without routerLink (or parent with children) -->
    <a *ngIf="(!item.routerLink || item.items) && item.visible !== false"
       [attr.href]="item.url"
       (click)="itemClick($event)"
       (mouseenter)="onMouseEnter()"
       [ngClass]="item.class"
       class="menu-link"
       [attr.target]="item.target"
       tabindex="0"
       pRipple
       [pTooltip]="item.label"
       [tooltipDisabled]="!(isSlim && root && !active)">
      <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
    </a>

    <!-- link with routerLink (leaf) -->
    <a *ngIf="item.routerLink && !item.items && item.visible !== false"
       (click)="itemClick($event)"
       (mouseenter)="onMouseEnter()"
       [ngClass]="item.class"
       class="menu-link"
       [routerLink]="item.routerLink"
       routerLinkActive="active-route"
       [routerLinkActiveOptions]="item.routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
       [fragment]="item.fragment"
       [queryParamsHandling]="item.queryParamsHandling"
       [preserveFragment]="item.preserveFragment"
       [skipLocationChange]="item.skipLocationChange"
       [replaceUrl]="item.replaceUrl"
       [state]="item.state"
       [queryParams]="item.queryParams"
       [attr.target]="item.target"
       tabindex="0"
       pRipple
       [pTooltip]="item.label"
       [tooltipDisabled]="!(isSlim && root)">
      <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
    </a>

    <!-- children -->
    <ul #submenu *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation" (@children.done)="onSubmenuAnimated($event)">
      <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
        <li app-menuitem
            [translatePath]="translatePath"
            [item]="child"
            [index]="i"
            [parentKey]="key"
            [permissionChecker]="permissionChecker"
            [class]="child.badgeClass"></li>
      </ng-template>
    </ul>
  </ng-container>
  `,
  animations: [
    trigger('children', [
      state('collapsed', style({ height: '0' })),
      state('expanded', style({ height: '*' })),
      state('hidden', style({ display: 'none' })),
      state('visible', style({ display: 'block' })),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
  /** menu item object: { label, icon, routerLink?, items?, ... } */
  @Input() item: any;
  @Input() index!: number;

  /** set by parent <li app-menuitem [root]="true|false"> */
  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

  @Input() parentKey!: string;

  /** Optional prefix for i18n keys (e.g., 'menu.'). */
  @Input() translatePath = '';

  /**
   * Optional permission checker injected by the parent.
   * Return true if the user has the permission string.
   * If not provided, everything is considered visible.
   */
  @Input() permissionChecker?: (permission: string) => boolean;

  @ViewChild('submenu') submenu!: ElementRef;

  active = false;
  key = '';

  private menuSourceSubscription: Subscription;
  private menuResetSubscription: Subscription;

  // Flattened [{ path, permissions[] }]
  private routePermissions: { path: string; permissions: string[] }[] = [];

  constructor(
    public layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    public router: Router,
    private appSidebar: SidebarComponent,
    private menuService: MenuService
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe((value) => {
      Promise.resolve().then(() => {
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(this.key + '-');
        } else if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
          this.active = false;
        }
      });
    });

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      if (this.isSlimPlus || this.isSlim || this.isHorizontal) {
        this.active = false;
      } else if (this.item?.routerLink) {
        this.updateActiveStateFromRoute();
      }
    });
  }

  ngOnInit() {
    // collect route data.permissions (if you use them)
    this.routePermissions = this.flattenRoutes(this.router.config);

    // apply permissions (no external service; optional checker)
    this.applyVisibility(this.item);

    this.key = this.parentKey ? `${this.parentKey}-${this.index}` : String(this.index);

    if (!(this.isSlimPlus || this.isSlim || this.isHorizontal) && this.item?.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  ngAfterViewChecked() {
    if (
      this.root &&
      this.active &&
      this.layoutService.isDesktop() &&
      (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())
    ) {
      this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement?.parentElement);
    }
  }

  ngOnDestroy() {
    this.menuSourceSubscription?.unsubscribe();
    this.menuResetSubscription?.unsubscribe();
  }

  // ----- UI / interaction -----

  itemClick(event: Event) {
    if (this.item?.disabled) {
      event.preventDefault();
      return;
    }

    if ((this.root && this.isSlim) || this.isHorizontal || this.isSlimPlus) {
      this.layoutService.state.menuHoverActive = !this.layoutService.state.menuHoverActive;
    }

    if (this.item?.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    if (this.item?.items) {
      this.active = !this.active;
      if (this.root && this.active && (this.isSlim || this.isHorizontal || this.isSlimPlus)) {
        this.layoutService.onOverlaySubmenuOpen();
      }
    } else {
      if (this.layoutService.isMobile()) {
        this.layoutService.state.staticMenuMobileActive = false;
      }
      if (this.isSlim || this.isHorizontal || this.isSlimPlus) {
        this.menuService.reset();
        this.layoutService.state.menuHoverActive = false;
      }
    }

    this.menuService.onMenuStateChange({ key: this.key });
  }

  onMouseEnter() {
    if (this.root && (this.isSlim || this.isHorizontal || this.isSlimPlus) && this.layoutService.isDesktop()) {
      if (this.layoutService.state.menuHoverActive) {
        this.active = true;
        this.menuService.onMenuStateChange({ key: this.key });
      }
    }
  }

  onSubmenuAnimated(event: AnimationEvent) {
    if (
      event.toState === 'visible' &&
      this.layoutService.isDesktop() &&
      (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())
    ) {
      const el = event.element as HTMLUListElement;
      const elParent = el.parentElement as HTMLUListElement;
      this.calculatePosition(el, elParent);
    }
  }

  get submenuAnimation() {
    if (this.layoutService.isDesktop() && (this.isHorizontal || this.isSlim || this.isSlimPlus)) {
      return this.active ? 'visible' : 'hidden';
    }
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass() {
    return this.active && !this.root;
  }

  // ----- helpers -----

  updateActiveStateFromRoute() {
    const first = this.item?.routerLink?.[0];
    if (!first) return;
    const activeRoute = this.router.isActive(first, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    });
    if (activeRoute) this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
  }

  calculatePosition(overlay: HTMLElement, target: HTMLElement | null) {
    if (!overlay || !target) return;
    const { left, top } = target.getBoundingClientRect();
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;
    const oWidth = overlay.offsetWidth;
    const oHeight = overlay.offsetHeight;
    const scrollbarWidth = DomHandler.calculateScrollbarWidth();

    overlay.style.top = '';
    overlay.style.left = '';

    if (this.isHorizontal) {
      const width = left + oWidth + scrollbarWidth;
      overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
    } else if (this.isSlim || this.isSlimPlus) {
      const height = top + oHeight;
      overlay.style.top = vHeight < height ? `${top - (height - vHeight)}px` : `${top}px`;
    }
  }

  get isHorizontal() {
    return this.layoutService.isHorizontal();
  }

  get isSlim() {
    return this.layoutService.isSlim();
  }

  get isSlimPlus() {
    return this.layoutService.isSlimPlus();
  }

  // ----- visibility / permissions without external service -----

  private applyVisibility(node: any) {
    // default visible unless explicitly false
    node.visible = node.visible !== false;

    if (node.items?.length) {
      node.items.forEach((c: any) => this.applyVisibility(c));
      // parent is visible if any child visible
      node.visible = node.items.some((c: any) => c.visible);
      return;
    }

    // leaf with routerLink: honor route.data.permissions if present
    const route = this.findRouteForItem(node);
    const perms = route?.permissions ?? [];

    if (perms.length && this.permissionChecker) {
      node.visible = perms.some((p) => this.permissionChecker!(p));
    } else if (perms.length && !this.permissionChecker) {
      // no checker provided => default allow
      node.visible = true;
    }
  }

  private findRouteForItem(item: any) {
    const link = item?.routerLink?.[0];
    if (!link) return undefined;

    // normalize '/foo/bar' -> 'foo/bar'
    const normalized = link.startsWith('/') ? link.slice(1) : link;
    return this.routePermissions.find((r) => r.path.endsWith(normalized));
  }

  private flattenRoutes(routes: any[], parentPath: string = ''): { path: string; permissions: string[] }[] {
    let result: { path: string; permissions: string[] }[] = [];
    for (const r of routes) {
      const currentPath = r.path || '';
      const fullPath = [parentPath, currentPath].filter(Boolean).join('/');
      if (r.data?.permissions) {
        result.push({ path: fullPath, permissions: r.data.permissions });
      }
      if (r.children) {
        result = result.concat(this.flattenRoutes(r.children, fullPath));
      }
    }
    return result;
  }

  translateKey(key: string) {
    return this.translatePath ? `${this.translatePath}${key}` : key;
  }
}
