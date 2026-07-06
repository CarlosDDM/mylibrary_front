import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkManagement } from './work-management';

describe('WorkManagement', () => {
  let component: WorkManagement;
  let fixture: ComponentFixture<WorkManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
