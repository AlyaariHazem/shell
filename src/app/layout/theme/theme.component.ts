import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme',
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {
  dayLightTheme: boolean = true;

  constructor(    private themeService: ThemeService ,
     ){
    this.dayLightTheme=  this.themeService.isLightMode()
     }

    toggleDarkMode() {
       this.themeService.swithTheme()
       this.dayLightTheme=  this.themeService.isLightMode()

    }

  ngOnInit() {


  }

}
