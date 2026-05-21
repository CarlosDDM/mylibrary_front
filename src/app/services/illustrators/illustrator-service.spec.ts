import { TestBed } from '@angular/core/testing';

import { IllustratorService } from './illustrator-service';

describe('IllustratorService', () => {
  let service: IllustratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IllustratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
