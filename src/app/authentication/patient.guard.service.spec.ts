import { TestBed } from '@angular/core/testing';

import { PatientGuardService } from './patient.guard.service';

describe('PatientGuardService', () => {
  let service: PatientGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
