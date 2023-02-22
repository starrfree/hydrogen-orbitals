import { TestBed } from '@angular/core/testing';

import { OrbitalRendererService } from './orbital-renderer.service';

describe('OrbitalRendererService', () => {
  let service: OrbitalRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitalRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
