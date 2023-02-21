import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuctionService } from '../auction.service';
import { compareIds } from '../helpers/objectId';
import { DocumentUpdate } from '../helpers/documentUpdate';

@Component({
  selector: 'app-auction-catalogue',
  templateUrl: './auction-catalogue.component.html',
  styleUrls: ['./auction-catalogue.component.scss']
})
export class AuctionCatalogueComponent implements OnInit, OnDestroy {
  private observableFromCollectionWatcher: any = new Observable();
  auctions: any[] = [];

  constructor(private auctionService: AuctionService) {
  }

  async ngOnInit(): Promise<void> {
    this.auctions = await this.auctionService.load(20);
    const ids = this.auctions.map(a => a._id);
    const watcher = await this.auctionService.getCollectionWatcher(ids);
    
    if (!watcher) {
      return;
    }

    this.observableFromCollectionWatcher = watcher.subscribe({
      next: (v) => {
        this.updateAuction(v);
      }
    });
  }

  ngOnDestroy(): void {
    this.observableFromCollectionWatcher.unsubscribe();
  }

  private updateAuction(updatedItem: DocumentUpdate<any>) {
    const existingItem = this.auctions.find(a => compareIds(a._id, updatedItem._id));

    const updatedFields = updatedItem.updateDescription?.updatedFields || [];
    for (let field of Object.keys(updatedFields)) {
      const value = updatedFields[field];
      existingItem[field] = value;
    }
  }
}
