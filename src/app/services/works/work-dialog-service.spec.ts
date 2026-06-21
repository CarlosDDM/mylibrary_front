import { TestBed } from '@angular/core/testing';

import { WorkDialogService } from './work-dialog-service';

describe('WorkDrawerService', () => {
  let service: WorkDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
