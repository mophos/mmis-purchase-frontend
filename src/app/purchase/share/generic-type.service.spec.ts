import { TestBed, inject } from '@angular/core/testing';

import { GenericTypeService } from './generic-type.service';

describe('GenericTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericTypeService]
    });
  });

  it('should be created', inject([GenericTypeService], (service: GenericTypeService) => {
    expect(service).toBeTruthy();
  }));
});
