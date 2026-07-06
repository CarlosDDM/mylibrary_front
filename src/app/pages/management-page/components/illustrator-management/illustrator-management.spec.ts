import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratorManagement } from './illustrator-management';

describe('IllustratorManagement', () => {
  let component: IllustratorManagement;
  let fixture: ComponentFixture<IllustratorManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustratorManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(IllustratorManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
