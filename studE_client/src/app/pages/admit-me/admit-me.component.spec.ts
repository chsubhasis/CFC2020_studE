import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitMeComponent } from './admit-me.component';

describe('AdmitMeComponent', () => {
  let component: AdmitMeComponent;
  let fixture: ComponentFixture<AdmitMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
