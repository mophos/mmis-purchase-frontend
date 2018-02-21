import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeFormComponent } from './committee-form.component';

describe('CommitteeFormComponent', () => {
  let component: CommitteeFormComponent;
  let fixture: ComponentFixture<CommitteeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
