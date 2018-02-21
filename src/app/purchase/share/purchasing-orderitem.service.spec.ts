import { TestBed, inject } from '@angular/core/testing';

import { PurchasingOrderItemService } from './purchasing-orderitem.service';

describe('PurchasingOrderitemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasingOrderItemService]
    });
  });

  it('should ...', inject([PurchasingOrderItemService], (service: PurchasingOrderItemService) => {
    expect(service).toBeTruthy();
  }));
});
