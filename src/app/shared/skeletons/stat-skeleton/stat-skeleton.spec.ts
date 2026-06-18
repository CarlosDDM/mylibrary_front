import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatSkeleton } from './stat-skeleton';

describe('StatSkeleton', () => {
  let component: StatSkeleton;
  let fixture: ComponentFixture<StatSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(StatSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
