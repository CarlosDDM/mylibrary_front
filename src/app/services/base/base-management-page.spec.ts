import { TestBed } from '@angular/core/testing';

import { BaseManagementPage } from './base-management-page';

describe('BaseManagementPage', () => {
  let service: BaseManagementPage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseManagementPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
