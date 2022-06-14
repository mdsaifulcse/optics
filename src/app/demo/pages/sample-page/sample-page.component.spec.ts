import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SamplePageComponent } from './sample-page.component';

describe('SamplePageComponent', () => {
  let component: SamplePageComponent;
  let fixture: ComponentFixture<SamplePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
