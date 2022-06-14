import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicProgressBarComponent } from './basic-progress-bar.component';

describe('BasicProgressBarComponent', () => {
  let component: BasicProgressBarComponent;
  let fixture: ComponentFixture<BasicProgressBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
