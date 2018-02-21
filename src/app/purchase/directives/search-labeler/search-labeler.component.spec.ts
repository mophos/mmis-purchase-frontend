import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLabelerComponent } from './search-labeler.component';

describe('SearchLabelerComponent', () => {
  let component: SearchLabelerComponent;
  let fixture: ComponentFixture<SearchLabelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLabelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
