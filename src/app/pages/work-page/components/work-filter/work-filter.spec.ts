import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFilter } from './work-filter';

describe('WorkFilter', () => {
  let component: WorkFilter;
  let fixture: ComponentFixture<WorkFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
