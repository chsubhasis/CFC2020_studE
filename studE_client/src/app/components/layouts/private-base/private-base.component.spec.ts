import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateBaseComponent } from './private-base.component';

describe('PrivateBaseComponent', () => {
  let component: PrivateBaseComponent;
  let fixture: ComponentFixture<PrivateBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
