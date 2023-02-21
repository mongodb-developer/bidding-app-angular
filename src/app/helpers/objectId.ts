import * as Realm from "realm-web";

export const {
  BSON: { ObjectId },
} = Realm;

export function compareIds(a: Uint8Array, b: Uint8Array) {
    const oa = new ObjectId(a);
    const ob = new ObjectId(b);

    return oa.equals(ob);
}
