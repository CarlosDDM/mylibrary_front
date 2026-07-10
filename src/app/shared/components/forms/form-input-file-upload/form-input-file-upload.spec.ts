import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputFileUpload } from './form-input-file-upload';

describe('FormInputFileUpload', () => {
  let component: FormInputFileUpload;
  let fixture: ComponentFixture<FormInputFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputFileUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputFileUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
