import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOfficerComponent } from './select-officer.component';

describe('SelectOfficerComponent', () => {
  let component: SelectOfficerComponent;
  let fixture: ComponentFixture<SelectOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
