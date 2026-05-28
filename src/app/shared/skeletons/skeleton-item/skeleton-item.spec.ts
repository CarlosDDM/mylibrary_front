import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonItem } from './skeleton-item';

describe('SkeletonItem', () => {
  let component: SkeletonItem;
  let fixture: ComponentFixture<SkeletonItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
