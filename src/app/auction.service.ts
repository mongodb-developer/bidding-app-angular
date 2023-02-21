import { Injectable } from '@angular/core';
import { ObjectId } from './helpers/objectId';
import { extractUpdate, fromChangeEvent } from './custom-operators';
import { RealmAppService } from './realm-app.service';
import { Auction } from './auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  constructor(private realmAppService: RealmAppService) {
  }

  async findOne(id: any) {
    const collection = await this.getCollection();
    if (!collection) {
      console.error('Failed to load collection.');
      throw new Error('No item found.');
    }

    return collection.findOne({ _id: new ObjectId(id)});
  }

  async load(limit = 10) {
    const collection = await this.getCollection();
    if (!collection) {
      console.error('Failed to load collection.');
      return [];
    }

    return collection?.aggregate([
      { $limit: limit }
    ]);
  }

  async getCollectionWatcher(ids: string[]) {
    if (!ids.length) {
      return;
    }

    const collection = await this.getCollection();
    if (!collection) {
      return;
    }

    const objectIds = ids.map(id => new ObjectId(id));

    const generator = collection.watch({ objectIds });
    return fromChangeEvent(generator).pipe(extractUpdate);
  }

  async bid(auction: Auction, increment: number = 1) {
    const collection = await this.getCollection();
    await collection?.findOneAndUpdate({
      _id: auction._id,
      currentBid: auction.currentBid,
    }, {
      $inc: { currentBid: increment },
    }, {
      returnNewDocument: true
    });
  }

  private async getCollection() {
    const app = await this.realmAppService.getAppInstance();
    const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    const collection = mongo?.db('bidding').collection<Auction>('auctions');

    return collection;
  }
}
