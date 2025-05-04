import { TestBed } from '@angular/core/testing';

import { FileAttenteService } from './file-attente.service';

describe('FileAttenteService', () => {
  let service: FileAttenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileAttenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
