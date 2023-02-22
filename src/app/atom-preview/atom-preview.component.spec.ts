import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomPreviewComponent } from './atom-preview.component';

describe('AtomPreviewComponent', () => {
  let component: AtomPreviewComponent;
  let fixture: ComponentFixture<AtomPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
