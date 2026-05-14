import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputMultiselect } from './form-input-multiselect';

describe('FormInputMultiselect', () => {
  let component: FormInputMultiselect;
  let fixture: ComponentFixture<FormInputMultiselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputMultiselect],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputMultiselect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
