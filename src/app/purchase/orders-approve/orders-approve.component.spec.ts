import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersApproveComponent } from './orders-approve.component';

describe('OrdersApproveComponent', () => {
  let component: OrdersApproveComponent;
  let fixture: ComponentFixture<OrdersApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
