import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputCheckbox } from './form-input-checkbox';

describe('FormInputCheckbox', () => {
  let component: FormInputCheckbox;
  let fixture: ComponentFixture<FormInputCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputCheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
