import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigliettoVisitaComponent } from './biglietto-visita.component';

describe('BigliettoVisitaComponent', () => {
  let component: BigliettoVisitaComponent;
  let fixture: ComponentFixture<BigliettoVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigliettoVisitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigliettoVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
