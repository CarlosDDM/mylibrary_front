import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputSelect } from './form-input-select';

describe('FormInputSelect', () => {
  let component: FormInputSelect;
  let fixture: ComponentFixture<FormInputSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
