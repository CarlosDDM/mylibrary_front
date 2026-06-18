import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieSkeleton } from './serie-skeleton';

describe('SerieSkeleton', () => {
  let component: SerieSkeleton;
  let fixture: ComponentFixture<SerieSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
