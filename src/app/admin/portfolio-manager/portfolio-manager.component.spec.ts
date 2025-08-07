import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioManagerComponent } from './portfolio-manager.component';

describe('PortfolioManagerComponent', () => {
  let component: PortfolioManagerComponent;
  let fixture: ComponentFixture<PortfolioManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortfolioManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
