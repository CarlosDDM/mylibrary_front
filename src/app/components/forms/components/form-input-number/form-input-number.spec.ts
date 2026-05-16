import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputNumber } from './form-input-number';

describe('FormInputNumber', () => {
  let component: FormInputNumber;
  let fixture: ComponentFixture<FormInputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputNumber],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
