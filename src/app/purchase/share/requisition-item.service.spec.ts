import { TestBed, inject } from '@angular/core/testing';

import { RequisitionItemService } from './requisition-item.service';

describe('RequisitionItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequisitionItemService]
    });
  });

  it('should ...', inject([RequisitionItemService], (service: RequisitionItemService) => {
    expect(service).toBeTruthy();
  }));
});
