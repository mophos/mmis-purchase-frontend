import { TestBed, inject } from '@angular/core/testing';

import { ContractProductsService } from './contract-products.service';

describe('ContractProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractProductsService]
    });
  });

  it('should ...', inject([ContractProductsService], (service: ContractProductsService) => {
    expect(service).toBeTruthy();
  }));
});
