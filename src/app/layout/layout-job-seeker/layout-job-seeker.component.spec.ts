import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutJobSeekerComponent } from './layout-job-seeker.component';

describe('LayoutJobSeekerComponent', () => {
  let component: LayoutJobSeekerComponent;
  let fixture: ComponentFixture<LayoutJobSeekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutJobSeekerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutJobSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
