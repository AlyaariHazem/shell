import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerMenuComponent } from './job-seeker-menu.component';

describe('JobSeekerMenuComponent', () => {
  let component: JobSeekerMenuComponent;
  let fixture: ComponentFixture<JobSeekerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
