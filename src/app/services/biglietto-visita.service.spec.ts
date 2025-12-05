import { TestBed } from '@angular/core/testing';

import { BigliettoVisitaService } from './biglietto-visita.service';

describe('BigliettoVisitaService', () => {
  let service: BigliettoVisitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigliettoVisitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
