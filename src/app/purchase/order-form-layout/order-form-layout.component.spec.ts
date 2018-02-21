import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFormLayoutComponent } from './order-form-layout.component';

describe('OrderFormLayoutComponent', () => {
  let component: OrderFormLayoutComponent;
  let fixture: ComponentFixture<OrderFormLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFormLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
