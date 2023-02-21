import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCatalogueComponent } from './auction-catalogue.component';

describe('AuctionCatalogueComponent', () => {
  let component: AuctionCatalogueComponent;
  let fixture: ComponentFixture<AuctionCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
