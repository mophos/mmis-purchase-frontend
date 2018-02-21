import { TestBed, inject } from '@angular/core/testing';

import { LabelerService } from './labeler.service';

describe('LabelerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabelerService]
    });
  });

  it('should ...', inject([LabelerService], (service: LabelerService) => {
    expect(service).toBeTruthy();
  }));
});
