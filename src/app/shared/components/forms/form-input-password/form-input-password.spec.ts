import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputPassword } from './form-input-password';

describe('FormInputPassword', () => {
  let component: FormInputPassword;
  let fixture: ComponentFixture<FormInputPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
