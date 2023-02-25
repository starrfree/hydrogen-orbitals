import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitalsListComponent } from './orbitals-list.component';

describe('OrbitalsListComponent', () => {
  let component: OrbitalsListComponent;
  let fixture: ComponentFixture<OrbitalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrbitalsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrbitalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
