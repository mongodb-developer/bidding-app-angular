import { ObjectId } from "./helpers/objectId";
import { BSON } from "realm-web";

export interface Auction {
    _id: string | BSON.ObjectId;
    name: string;
    currentBid: BSON.Decimal128;
    currentBidder: {
        _id: string | BSON.ObjectId;
        username: string;
    }
    ends: BSON.Timestamp;
}