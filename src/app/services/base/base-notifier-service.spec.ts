import { TestBed } from '@angular/core/testing';

import { BaseNotifierService } from './base-notifier-service';

describe('BaseNotifierService', () => {
  let service: BaseNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
