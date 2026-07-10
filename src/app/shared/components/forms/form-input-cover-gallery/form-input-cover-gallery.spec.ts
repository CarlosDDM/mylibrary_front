import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputCoverGallery } from './form-input-cover-gallery';

describe('FormInputCoverGallery', () => {
  let component: FormInputCoverGallery;
  let fixture: ComponentFixture<FormInputCoverGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputCoverGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputCoverGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
