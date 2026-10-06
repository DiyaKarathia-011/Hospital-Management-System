import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppoitment } from './add-appoitment';

describe('AddAppoitment', () => {
  let component: AddAppoitment;
  let fixture: ComponentFixture<AddAppoitment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAppoitment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppoitment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
