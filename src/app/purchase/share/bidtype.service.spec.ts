import { TestBed, inject } from '@angular/core/testing';

import { BidtypeService } from './bidtype.service';

describe('BidtypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BidtypeService]
    });
  });

  it('should ...', inject([BidtypeService], (service: BidtypeService) => {
    expect(service).toBeTruthy();
  }));
});
