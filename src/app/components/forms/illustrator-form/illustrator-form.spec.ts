import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratorForm } from './illustrator-form';

describe('IllustratorForm', () => {
  let component: IllustratorForm;
  let fixture: ComponentFixture<IllustratorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustratorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(IllustratorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
