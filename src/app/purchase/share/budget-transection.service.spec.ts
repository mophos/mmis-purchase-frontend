import { TestBed, inject } from '@angular/core/testing';

import { BudgetTransectionService } from './budget-transection.service';

describe('BudgetTransectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetTransectionService]
    });
  });

  it('should be created', inject([BudgetTransectionService], (service: BudgetTransectionService) => {
    expect(service).toBeTruthy();
  }));
});
