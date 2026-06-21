import { TestBed } from '@angular/core/testing';

import { SerieDrawerService } from './serie-drawer-service';

describe('SerieDrawerService', () => {
  let service: SerieDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerieDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
