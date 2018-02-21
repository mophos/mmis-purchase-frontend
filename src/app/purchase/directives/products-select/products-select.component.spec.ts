import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSelectComponent } from './products-select.component';

describe('ProductsSelectComponent', () => {
  let component: ProductsSelectComponent;
  let fixture: ComponentFixture<ProductsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
