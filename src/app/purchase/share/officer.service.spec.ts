import { TestBed, inject } from '@angular/core/testing';

import { OfficerService } from './officer.service';

describe('OfficerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfficerService]
    });
  });

  it('should be created', inject([OfficerService], (service: OfficerService) => {
    expect(service).toBeTruthy();
  }));
});
