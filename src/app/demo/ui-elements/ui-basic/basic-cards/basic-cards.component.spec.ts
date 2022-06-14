import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicCardsComponent } from './basic-cards.component';

describe('BasicCardsComponent', () => {
  let component: BasicCardsComponent;
  let fixture: ComponentFixture<BasicCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
