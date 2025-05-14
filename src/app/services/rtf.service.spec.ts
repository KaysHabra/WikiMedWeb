import { TestBed } from '@angular/core/testing';

import { RtfService } from './rtf.service';

describe('RtfService', () => {
  let service: RtfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RtfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
