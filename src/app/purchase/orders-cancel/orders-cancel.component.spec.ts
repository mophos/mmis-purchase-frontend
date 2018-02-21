import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCancelComponent } from './orders-cancel.component';

describe('OrdersCancelComponent', () => {
  let component: OrdersCancelComponent;
  let fixture: ComponentFixture<OrdersCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
