import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputChip } from './form-input-chip';

describe('FormInputChip', () => {
  let component: FormInputChip;
  let fixture: ComponentFixture<FormInputChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputChip],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
