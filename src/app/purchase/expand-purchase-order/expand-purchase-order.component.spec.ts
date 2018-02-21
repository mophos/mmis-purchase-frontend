import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandPurchaseOrderComponent } from './expand-purchase-order.component';

describe('ExpandPurchaseOrderComponent', () => {
  let component: ExpandPurchaseOrderComponent;
  let fixture: ComponentFixture<ExpandPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
