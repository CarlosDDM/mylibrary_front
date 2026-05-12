import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseForm } from './franchise-form';

describe('FranchiseForm', () => {
  let component: FranchiseForm;
  let fixture: ComponentFixture<FranchiseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
