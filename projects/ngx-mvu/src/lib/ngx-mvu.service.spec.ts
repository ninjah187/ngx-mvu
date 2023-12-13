import { TestBed } from '@angular/core/testing';

import { NgxMvuService } from './ngx-mvu.service';

describe('NgxMvuService', () => {
  let service: NgxMvuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMvuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
