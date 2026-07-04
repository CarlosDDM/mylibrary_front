import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPassword } from './settings-password';

describe('SettingsPassword', () => {
  let component: SettingsPassword;
  let fixture: ComponentFixture<SettingsPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
