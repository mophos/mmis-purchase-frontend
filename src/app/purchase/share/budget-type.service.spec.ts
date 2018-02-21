import { TestBed, inject } from '@angular/core/testing';

import { BudgetTypeService } from './budget-type.service';

describe('BudgetTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetTypeService]
    });
  });

  it('should ...', inject([BudgetTypeService], (service: BudgetTypeService) => {
    expect(service).toBeTruthy();
  }));
});
