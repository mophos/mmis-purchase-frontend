import { TestBed, inject } from '@angular/core/testing';

import { BidProcessService } from './bid-process.service';

describe('BidProcessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BidProcessService]
    });
  });

  it('should ...', inject([BidProcessService], (service: BidProcessService) => {
    expect(service).toBeTruthy();
  }));
});
