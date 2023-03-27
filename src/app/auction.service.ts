import { Injectable } from '@angular/core';
import { ObjectId } from './helpers/objectId';
import { fromChangeEvent } from './custom-operators';
import { RealmAppService } from './realm-app.service';
import { Auction } from './auction';
import { isInUsernamesList } from './usernames';
import { filter, map } from 'rxjs/operators';

const isUpdateEvent = (event: any): event is Realm.Services.MongoDB.UpdateEvent<any> =>
event.operationType === 'update';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuctionService {
//   constructor(private realmAppService: RealmAppService) { }

//   private async getCollection() {
//     return;
//   }

//   async load(limit = 10) {
//     return [{
//       name: 'Fake data',
//       currentBid: 20,
//       currentBidder: 'no one',
//     }];
//   }

//   async findOne(id: any) {
//     return {};
//   }

//   async getCollectionWatcher(ids: any[]) {
//     return from([]);
//   }

//   async bid(
//     auction: Auction,
//     username: string,
//     increment: number = 1
//   ) {
//     // if (!isInUsernamesList(username)) {
//     //   return;
//     // }

//     // const collection = await this.getCollection();
//     // await collection?.findOneAndUpdate({
//     //   _id: auction._id,
//     //   currentBid: auction.currentBid,
//     //   currentBidder: auction.currentBidder
//     // }, {
//     //   $inc: { currentBid: increment },
//     //   $set: { currentBidder: username }
//     // });
//   }
// }


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

  async search(query: string) {
    const collection = await this.getCollection();

    return collection?.aggregate([
      {
        $search: {
          index: 'auctions_search',
          autocomplete: {
            path: 'name',
            query,
          }
        }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          name: 1,
        }
      }
    ]) as Promise<Auction[]>;
  }

  async load(limit = 10) {
    const collection = await this.getCollection();
    if (!collection) {
      console.error('Failed to load collection.');
      return [];
    }

    return collection.aggregate([
      { $limit: limit },
      { $sort: { ends: 1 } }
    ]) as Promise<Auction[]>;
  }

  async getCollectionWatcher(ids: any[]) {
    if (!ids.length) {
      return;
    }

    const collection = await this.getCollection();
    if (!collection) {
      return;
    }

    const objectIds = ids.map(id => new ObjectId(id));

    const generator = collection.watch({ ids: objectIds });
    return fromChangeEvent(generator).pipe(
      filter(isUpdateEvent),
      map(event => ({ updateDescription: event.updateDescription, _id: event.documentKey._id }))
    );
  }

  async bid(auction: Auction, username: string, increment: number = 1) {
    if (!isInUsernamesList(username)) {
      return;
    }

    if (increment < 1 || increment > 1000) {
      return;
    }

    const collection = await this.getCollection();
    await collection?.findOneAndUpdate({
      _id: auction._id,
      currentBid: auction.currentBid,
      currentBidder: auction.currentBidder
    }, {
      $inc: { currentBid: increment },
      $set: { currentBidder: username }
    });
  }

  private async getCollection() {
    const app = await this.realmAppService.getAppInstance();
    const mongo = app.currentUser?.mongoClient('mongodb-atlas');
    const collection = mongo?.db('auctions').collection<Auction>('cars');

    return collection;
  }
}
