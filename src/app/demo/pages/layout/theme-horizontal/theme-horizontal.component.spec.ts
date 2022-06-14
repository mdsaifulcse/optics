import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThemeHorizontalComponent } from './theme-horizontal.component';

describe('ThemeHorizontalComponent', () => {
  let component: ThemeHorizontalComponent;
  let fixture: ComponentFixture<ThemeHorizontalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
