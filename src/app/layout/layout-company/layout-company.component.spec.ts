import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutCompanyComponent } from './layout-company.component';

describe('LayoutCompanyComponent', () => {
  let component: LayoutCompanyComponent;
  let fixture: ComponentFixture<LayoutCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
