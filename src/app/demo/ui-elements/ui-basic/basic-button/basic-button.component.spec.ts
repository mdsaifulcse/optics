import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicButtonComponent } from './basic-button.component';

describe('BasicButtonComponent', () => {
  let component: BasicButtonComponent;
  let fixture: ComponentFixture<BasicButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
