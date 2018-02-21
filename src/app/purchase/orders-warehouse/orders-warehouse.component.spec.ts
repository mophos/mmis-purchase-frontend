import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersWarehouseComponent } from './orders-warehouse.component';

describe('OrdersWarehouseComponent', () => {
  let component: OrdersWarehouseComponent;
  let fixture: ComponentFixture<OrdersWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
