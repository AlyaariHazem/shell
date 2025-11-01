import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, EventEmitter, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ThemeService implements OnDestroy{

    private observer!: MutationObserver;
  private renderer!: Renderer2;
  themeChanged: EventEmitter<{ isLightMode: boolean }> = new EventEmitter<{ isLightMode: boolean }>();
   constructor(@Inject(DOCUMENT) private document: Document,
  rendererFactory: RendererFactory2,
 private router: Router) {
        this.renderer = rendererFactory.createRenderer(null, null);

    // 1️⃣ Watch for body class changes
    this.observer = new MutationObserver(() => {
      this.updateAgGridThemes();
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList:true
    });

    // 2️⃣ Run after every page navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.updateAgGridThemes(), 0);
      });

    // 3️⃣ First load check
    this.updateAgGridThemes();
    this.swithTheme(this.getCurrentTheme() )

  }
private updateAgGridThemes(): void {
   
    const isDark = document.body.classList.contains('dark');

    const grids = document.querySelectorAll('ag-grid-angular');
    grids.forEach((grid) => {
      if (isDark) {
        if (grid.classList.contains('ag-theme-alpine')) {
          this.renderer.removeClass(grid, 'ag-theme-alpine');
          this.renderer.addClass(grid, 'ag-theme-alpine-dark');
        }
      } else {
        if (grid.classList.contains('ag-theme-alpine-dark')) {
          this.renderer.removeClass(grid, 'ag-theme-alpine-dark');
          this.renderer.addClass(grid, 'ag-theme-alpine');
        }
      }
    });
  }


  getCurrentTheme() {
  
    return localStorage['dayTheme'] = localStorage['dayTheme'] === 'theme-dark' ? "theme-dark" : "theme-light";
  }
 
isLightMode():boolean{
  return   localStorage['dayTheme'] === 'theme-dark' ? false : true;

}
   
  swithTheme(theme?:string) {
    if(theme){
      localStorage['dayTheme'] = theme
      // this.themeChanged.emit({})
      // theme === 'theme-light' ? this.themeChanged.emit({isLightMode:true}) : this.themeChanged.emit({isLightMode:false});
    }else{
       
      localStorage['dayTheme'] = localStorage['dayTheme'] === 'theme-light' ? "theme-dark" : "theme-light";
    theme=localStorage['dayTheme']
    }
    this.themeChanged.emit({ isLightMode: theme === 'theme-light' });

    document.documentElement.style.setProperty('--card-header-background-color',  theme === 'theme-light' ? '#f5f5f5' : '#212324');
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = 'assets/scss/' + theme  + '.css';
     
    }
    let body = this.document.getElementsByTagName('body')[0];
    if( this.isLightMode()){
      body.classList.remove('dark');
     
    //  this.themeService. swithTheme("theme-dark")


     }else{
     body.classList.add('dark');
     // this.themeService. swithTheme("light-dark")

     }
   }
     ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
