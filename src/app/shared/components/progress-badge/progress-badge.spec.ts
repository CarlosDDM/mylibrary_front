import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBadge } from './progress-badge';

describe('ProgressBadge', () => {
  let component: ProgressBadge;
  let fixture: ComponentFixture<ProgressBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
