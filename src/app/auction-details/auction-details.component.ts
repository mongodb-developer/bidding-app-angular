import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuctionService } from '../auction.service';
import { DocumentUpdate } from '../helpers/documentUpdate';
import { compareIds } from '../helpers/objectId';
import { UserService } from '../user.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit, OnDestroy {
  private observableFromCollectionWatcher: any = new Observable();
  private currentId: any;
  auction: any;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private userService: UserService,
  ) {
    this.route.paramMap.subscribe({
      next: async params => {
        this.currentId = params.get('id');
        const item = await this.auctionService.findOne(this.currentId);
        this.auction = item;
      }
    });
  }

  async ngOnInit() {
    const watcher = await this.auctionService.getCollectionWatcher([this.currentId]);

    if (!watcher) {
      return;
    }

    this.observableFromCollectionWatcher = watcher.subscribe({
      next: update => {
        this.updateAuction(update);
      }
    })
    
  }

  ngOnDestroy(): void {
    this.observableFromCollectionWatcher.unsubscribe();
  }

  bid() {
    this.auctionService.bid(this.auction, this.userService.username);
  }

  private updateAuction(updatedItem: DocumentUpdate<any>) {
    if(!compareIds(updatedItem._id, this.auction._id)) {
      return;
    }

    const updatedFields = updatedItem.updateDescription?.updatedFields || [];
    for (let field of Object.keys(updatedFields)) {
      const value = updatedFields[field];
      this.auction[field] = value;
    }
  }
}
