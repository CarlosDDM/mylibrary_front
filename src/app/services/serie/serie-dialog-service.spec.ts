import { TestBed } from '@angular/core/testing';

import { SerieDialogService } from './serie-dialog-service';

describe('SerieDrawerService', () => {
  let service: SerieDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerieDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
