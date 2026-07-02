import { TestBed } from '@angular/core/testing';

import { FacadeDialogService } from './facade-dialog-service';

describe('FacadeDialogService', () => {
  let service: FacadeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacadeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
