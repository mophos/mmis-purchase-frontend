import { TestBed, inject } from '@angular/core/testing';

import { PackageService } from './package.service';

describe('PackageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageService]
    });
  });

  it('should ...', inject([PackageService], (service: PackageService) => {
    expect(service).toBeTruthy();
  }));
});
