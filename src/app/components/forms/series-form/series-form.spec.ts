import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesForm } from './series-form';

describe('SeriesForm', () => {
  let component: SeriesForm;
  let fixture: ComponentFixture<SeriesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
