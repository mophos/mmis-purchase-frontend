import { TestBed, inject } from '@angular/core/testing';

import { RequisitionService } from './requisition.service';

describe('RequisitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequisitionService]
    });
  });

  it('should ...', inject([RequisitionService], (service: RequisitionService) => {
    expect(service).toBeTruthy();
  }));
});
