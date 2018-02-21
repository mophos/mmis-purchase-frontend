import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCancelComponent } from './purchase-cancel.component';

describe('PurchaseCancelComponent', () => {
  let component: PurchaseCancelComponent;
  let fixture: ComponentFixture<PurchaseCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
