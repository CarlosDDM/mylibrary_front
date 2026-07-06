import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieManagement } from './serie-management';

describe('SerieManagement', () => {
  let component: SerieManagement;
  let fixture: ComponentFixture<SerieManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
