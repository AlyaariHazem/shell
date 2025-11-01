import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeComponent } from './theme.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeComponent,
    SharedModule
  ],
  declarations: [],
  exports:[
    ThemeComponent
  ]

})

export class ThemeModule { }
