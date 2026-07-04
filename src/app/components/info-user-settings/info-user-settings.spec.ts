import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUserSettings } from './info-user-settings';

describe('InfoUserSettings', () => {
  let component: InfoUserSettings;
  let fixture: ComponentFixture<InfoUserSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoUserSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoUserSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
