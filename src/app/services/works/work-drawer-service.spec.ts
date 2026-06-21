import { TestBed } from '@angular/core/testing';

import { WorkDrawerService } from './work-drawer-service';

describe('WorkDrawerService', () => {
  let service: WorkDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
