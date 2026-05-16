import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputCounter } from './form-input-counter';

describe('FormInputCounter', () => {
  let component: FormInputCounter;
  let fixture: ComponentFixture<FormInputCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputCounter],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
