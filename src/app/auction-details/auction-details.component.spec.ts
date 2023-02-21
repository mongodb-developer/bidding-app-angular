import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailsComponent } from './auction-details.component';

describe('AuctionDetailsComponent', () => {
  let component: AuctionDetailsComponent;
  let fixture: ComponentFixture<AuctionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
