import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlPreviewComponent } from './html-preview.component';

describe('HtmlPreviewComponent', () => {
  let component: HtmlPreviewComponent;
  let fixture: ComponentFixture<HtmlPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
