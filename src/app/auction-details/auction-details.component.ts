import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionService } from '../auction.service';
import { DocumentUpdate } from '../helpers/documentUpdate';
import { compareIds } from '../helpers/objectId';
import { UserService } from '../user.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss'],
})
export class AuctionDetailsComponent implements OnInit, OnDestroy {
  private bidUpdatesStream: Subscription;
  private currentId: string = '';
  auction: any;
  pulsingText = {
    pulsing: false
  };

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe({
      next: async params => {
        const id = params.get('id');
        if (!id) {
          return;
        }

        this.currentId = params.get('id')!;
        const item = await this.auctionService.findOne(this.currentId);
        this.auction = item;

        this.startBiddingWatcher(this.currentId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  bid(increment: number) {
    this.auctionService.bid(this.auction, this.userService.username, increment);
  }

  private async startBiddingWatcher(id: string) {
    this.destroySubscriptions();

    const watcher = await this.auctionService.getCollectionWatcher([id]);

    if (!watcher) {
      return;
    }

    this.bidUpdatesStream = watcher.subscribe({
      next: update => {
        this.updateAuction(update);
      }
    });
  }

  private destroySubscriptions() {
    if (this.bidUpdatesStream) {
      this.bidUpdatesStream.unsubscribe();
    }
  }

  private updateAuction(updatedItem: DocumentUpdate<any>) {
    if(!compareIds(updatedItem._id, this.auction._id)) {
      return;
    }

    const updatedFields = updatedItem.updateDescription?.updatedFields || [];
    for (let field of Object.keys(updatedFields)) {
      const value = updatedFields[field];
      this.auction[field] = value;

      this.animateCurrentBid(field);
    }
  }

  private animateCurrentBid(field: string) {
    if (field === 'currentBid') {
      this.pulsingText.pulsing = true;
    }
  }
}
