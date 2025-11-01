import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//PrimeNG
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MenuModule } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabViewModule } from 'primeng/tabview';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CarouselModule } from 'primeng/carousel';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
// others

const components = [
  FooterComponent,
];
const modules = [
  FormsModule,
  HeaderComponent,
  TableModule,
  MessagesModule,
  MessageModule,
  MenuModule,
  FileUploadModule,
  RadioButtonModule,
  CheckboxModule,
  SelectButtonModule,
  ToggleButtonModule,
  TabViewModule,
  OverlayPanelModule,
  CarouselModule,
  CalendarModule,
  MultiSelectModule,
  DropdownModule,
  StepsModule,
  DialogModule,
  AccordionModule,
  SliderModule,
  AutoCompleteModule,
  CardModule,
  RouterLinkActive,
  RouterLink,
  InputTextModule,
  InputMaskModule,
  InputNumberModule,
  InputSwitchModule,
  KeyFilterModule,
  ToolbarModule,
  TagModule,
];

@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  providers: [],
  exports: [
    ...modules,
    ...components
  ]
})
export class SharedModule {}
