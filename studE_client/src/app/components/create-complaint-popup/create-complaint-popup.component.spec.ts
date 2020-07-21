import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComplaintPopupComponent } from './create-complaint-popup.component';

describe('CreateComplaintPopupComponent', () => {
  let component: CreateComplaintPopupComponent;
  let fixture: ComponentFixture<CreateComplaintPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateComplaintPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComplaintPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
