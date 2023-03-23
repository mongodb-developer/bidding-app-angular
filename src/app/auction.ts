import { BSON } from 'realm-web';

export interface Auction {
    _id: string | BSON.ObjectId;
    name: string;
    imageURL: string;
    currentBid: BSON.Decimal128;
    currentBidder: string;
    ends: Date;
}
