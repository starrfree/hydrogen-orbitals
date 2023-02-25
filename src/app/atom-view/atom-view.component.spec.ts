import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomViewComponent } from './atom-view.component';

describe('AtomViewComponent', () => {
  let component: AtomViewComponent;
  let fixture: ComponentFixture<AtomViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
