import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTable } from './management-table';

describe('ManagementTable', () => {
  let component: ManagementTable;
  let fixture: ComponentFixture<ManagementTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
