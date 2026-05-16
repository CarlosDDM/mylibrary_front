import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperStats } from './wrapper-stats';

describe('WrapperStats', () => {
  let component: WrapperStats;
  let fixture: ComponentFixture<WrapperStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperStats],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
