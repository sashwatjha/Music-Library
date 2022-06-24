import { TestBed } from '@angular/core/testing';

import { SignuploginService } from './signuplogin.service';

describe('SignuploginService', () => {
  let service: SignuploginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignuploginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
