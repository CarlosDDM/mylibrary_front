import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseManagement } from './franchise-management';

describe('FranchiseManagement', () => {
  let component: FranchiseManagement;
  let fixture: ComponentFixture<FranchiseManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
