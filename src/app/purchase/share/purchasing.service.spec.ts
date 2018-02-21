import { TestBed, inject } from '@angular/core/testing';

import { PurchasingService } from './purchasing.service';

describe('PurchasingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasingService]
    });
  });

  it('should ...', inject([PurchasingService], (service: PurchasingService) => {
    expect(service).toBeTruthy();
  }));
});
