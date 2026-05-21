import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemProfile } from './item-profile';

describe('ItemProfile', () => {
  let component: ItemProfile;
  let fixture: ComponentFixture<ItemProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
