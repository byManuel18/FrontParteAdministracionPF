import { TestBed } from '@angular/core/testing';

import { GestorApiService } from './gestor-api.service';

describe('GestorApiService', () => {
  let service: GestorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
