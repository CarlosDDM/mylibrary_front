import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSection } from './home-section';

describe('HomeSection', () => {
  let component: HomeSection;
  let fixture: ComponentFixture<HomeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSection],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
