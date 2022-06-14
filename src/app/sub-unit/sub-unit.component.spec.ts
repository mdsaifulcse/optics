import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubUnitComponent } from './sub-unit.component';

describe('SubUnitComponent', () => {
  let component: SubUnitComponent;
  let fixture: ComponentFixture<SubUnitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
