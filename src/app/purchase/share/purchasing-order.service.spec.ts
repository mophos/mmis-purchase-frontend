import { TestBed, inject } from '@angular/core/testing';

import { PurchasingOrderService } from './purchasing-order.service';

describe('PurchasingOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasingOrderService]
    });
  });

  it('should ...', inject([PurchasingOrderService], (service: PurchasingOrderService) => {
    expect(service).toBeTruthy();
  }));
});
