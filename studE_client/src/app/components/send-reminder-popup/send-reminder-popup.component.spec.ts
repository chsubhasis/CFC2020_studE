import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReminderPopupComponent } from './send-reminder-popup.component';

describe('SendReminderPopupComponent', () => {
  let component: SendReminderPopupComponent;
  let fixture: ComponentFixture<SendReminderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReminderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReminderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
