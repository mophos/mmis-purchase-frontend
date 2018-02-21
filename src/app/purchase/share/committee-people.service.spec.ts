import { TestBed, inject } from '@angular/core/testing';

import { CommitteePeopleService } from './committee-people.service';

describe('CommitteePeopleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommitteePeopleService]
    });
  });

  it('should ...', inject([CommitteePeopleService], (service: CommitteePeopleService) => {
    expect(service).toBeTruthy();
  }));
});
