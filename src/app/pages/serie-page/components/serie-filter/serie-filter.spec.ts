import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieFilter } from './serie-filter';

describe('SerieFilter', () => {
  let component: SerieFilter;
  let fixture: ComponentFixture<SerieFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
