import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksDetailSkeleton } from './works-detail-skeleton';

describe('WorksDetailSkeleton', () => {
  let component: WorksDetailSkeleton;
  let fixture: ComponentFixture<WorksDetailSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorksDetailSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksDetailSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
